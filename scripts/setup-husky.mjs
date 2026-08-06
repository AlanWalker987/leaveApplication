import { existsSync } from 'node:fs';

if (!existsSync('.husky')) {
  process.exit(0);
}

process.exit(0);
