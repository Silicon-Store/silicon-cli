#!/usr/bin/env node
import { Command } from 'commander';

import { login, logout, whoami } from './auth.js';
import * as api from './api.js';

function out(data: unknown) {
  console.log(JSON.stringify(data, null, 2));
}

async function run(fn: () => Promise<unknown>) {
  try {
    out(await fn());
  } catch (e) {
    console.error(`Error: ${(e as Error).message}`);
    process.exit(1);
  }
}

const program = new Command();
program
  .name('silicon')
  .description('Silicon CLI — shop the web from your terminal and AI agents. Sign in once, no API keys.')
  .version('1.0.0');

const auth = program.command('auth').description('Sign in / out');
auth.command('login').description('Sign in with your Silicon account (opens a browser)').action(login);
auth.command('logout').description('Sign out and remove the local token').action(logout);
program.command('whoami').description('Show the signed-in account').action(() => run(whoami));

program
  .command('product <url>')
  .description('Look up a product by its URL')
  .action((url: string) => run(() => api.product(url)));

program
  .command('search <query>')
  .description('Find a product across retailers')
  .option('-r, --region <region>', 'UK or US', 'UK')
  .action((query: string, opts: { region: string }) => run(() => api.search(query, opts.region)));

program
  .command('compare <query>')
  .description('Compare a product across retailers')
  .option('-r, --region <region>', 'UK or US', 'UK')
  .action((query: string, opts: { region: string }) => run(() => api.compare(query, opts.region)));

program
  .command('retailers')
  .description('List supported retailers')
  .option('-r, --region <region>', 'UK or US')
  .action((opts: { region?: string }) => run(() => api.retailers(opts.region)));

program.parseAsync().catch((e) => {
  console.error(e);
  process.exit(1);
});
