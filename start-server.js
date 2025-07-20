#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🍺 Starting BeerCSS UI Components dev server...');

const devServer = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit'
});

devServer.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
});

devServer.on('close', (code) => {
  console.log(`🏁 Server stopped with code ${code}`);
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping server...');
  devServer.kill('SIGINT');
  process.exit(0);
});
