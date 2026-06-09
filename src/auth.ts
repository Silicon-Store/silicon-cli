import http from 'node:http';
import crypto from 'node:crypto';
import open from 'open';

import { PLATFORM_URL, saveToken, clearToken, getToken } from './config.js';
import { me } from './api.js';

/**
 * Browser sign-in (loopback OAuth). Opens the hosted authorize page; once the
 * user is signed in there, it redirects back to a one-shot localhost server with
 * the CLI token. No API keys to manage.
 */
export async function login(): Promise<void> {
  const state = crypto.randomBytes(16).toString('hex');
  const server = http.createServer();
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = (server.address() as { port: number }).port;

  const authUrl = `${PLATFORM_URL}/cli/authorize?port=${port}&state=${state}`;
  console.log('Opening your browser to sign in…');
  console.log(`If it doesn't open, visit:\n  ${authUrl}\n`);
  open(authUrl).catch(() => {});

  const token = await new Promise<string>((resolve, reject) => {
    const timeout = setTimeout(() => {
      server.close();
      reject(new Error('Timed out waiting for sign-in.'));
    }, 120_000);

    server.on('request', (req, res) => {
      const u = new URL(req.url || '/', `http://127.0.0.1:${port}`);
      if (u.pathname !== '/callback') {
        res.writeHead(404).end();
        return;
      }
      const ok = u.searchParams.get('state') === state;
      const tok = u.searchParams.get('token');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(
        `<html><body style="font-family:system-ui;text-align:center;padding-top:80px">
         <h2>${ok && tok ? 'Signed in to Silicon ✓' : 'Sign-in failed'}</h2>
         <p>You can close this tab and return to your terminal.</p></body></html>`,
      );
      clearTimeout(timeout);
      server.close();
      if (ok && tok) resolve(tok);
      else reject(new Error('Sign-in failed (state mismatch or no token).'));
    });
  });

  saveToken(token);
  try {
    const who = await me();
    console.log(`\n✓ Signed in as ${who.email} (${who.tier} plan).`);
  } catch {
    console.log('\n✓ Signed in.');
  }
}

export function logout(): void {
  clearToken();
  console.log('Signed out.');
}

export async function whoami(): Promise<void> {
  if (!getToken()) {
    console.log('Not signed in. Run `silicon auth login`.');
    return;
  }
  const who = await me();
  console.log(`${who.email} · ${who.tier} plan · account ${who.account_id}`);
}
