#!/usr/bin/env node
// AI-GENERATED

const { execSync } = require('child_process');
const readline = require('readline');

async function main() {
  const input = await new Promise((resolve) => {
    let data = '';
    const rl = readline.createInterface({ input: process.stdin });
    rl.on('line', (line) => (data += line));
    rl.on('close', () => resolve(data));
  });

  let filePath = '';
  try {
    const payload = JSON.parse(input);
    filePath = payload?.tool_input?.file_path ?? '';
  } catch {
    process.exit(0);
  }

  let project = null;
  if (filePath.includes('exam-scheduler-server')) {
    project = 'exam-scheduler-server';
  } else if (filePath.includes('exam-scheduler-frontend')) {
    project = 'exam-scheduler-frontend';
  } else {
    process.exit(0);
  }

  console.log(`⟳ tsc: ${project}`);
  try {
    execSync('npx tsc --noEmit', { cwd: project, stdio: 'inherit' });
    console.log(`✓ ${project}`);
  } catch {
    process.stderr.write(`✗ TypeScript errors in ${project} — flagging for Claude to fix\n`);
    process.exit(2);
  }
}

main();