// Entry for the make.fun bounty "The agent builds a game from one prompt"
// (Node 22, standard library only): it copies POST.json from the repository
// root to /output/POST.json, where the gate reads the post's address.
// The post itself is the entry: a short video of an AI agent building a tiny
// browser game from one prompt, posted natively on X from a public account.
// Before copying, this validates that POST.json parses and names an X post,
// so a placeholder or a mistyped address fails loudly instead of entering
// a post the gate would refuse.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  const raw = readFileSync(join(BOT_DIR, 'POST.json'), 'utf8');
  let post: unknown;
  try {
    post = JSON.parse(raw);
  } catch {
    throw new Error('POST.json is not valid JSON');
  }
  const url = (post as { url?: unknown }).url;
  if (
    typeof url !== 'string' ||
    !url.startsWith('https://x.com/') ||
    !url.includes('/status/')
  ) {
    throw new Error('POST.json must hold an object with an X post url (https://x.com/<handle>/status/<id>)');
  }
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
