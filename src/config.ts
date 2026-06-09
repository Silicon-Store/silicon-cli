import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * Local credential store. The CLI token (issued by the hosted sign-in) lives in
 * ~/.silicon/config.json with 0600 perms — same shape as gh/vercel. The user
 * never sees or pastes a key; `silicon auth login` writes it here.
 */

const DIR = path.join(os.homedir(), '.silicon');
const FILE = path.join(DIR, 'config.json');

export const PLATFORM_URL = process.env.SILICON_PLATFORM_URL || 'https://platform.siliconstore.com';
export const API_BASE = process.env.SILICON_API_BASE || 'https://productapi.siliconstore.com';

interface Config {
  token?: string;
}

function read(): Config {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8')) as Config;
  } catch {
    return {};
  }
}

export function saveToken(token: string): void {
  fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify({ token }, null, 2), { mode: 0o600 });
}

export function getToken(): string | null {
  return read().token ?? null;
}

export function clearToken(): void {
  try {
    fs.rmSync(FILE);
  } catch {
    /* nothing to clear */
  }
}
