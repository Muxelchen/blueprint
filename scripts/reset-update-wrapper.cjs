#!/usr/bin/env node

// This wrapper script provides the documented CLI interface for reset-update
const { resetUpdate } = require('./reset-update.cjs');

function parseArguments() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🔄 Blueprint Reset-Update Command

Usage: npm run cli reset-update <projekt-name> [options]

Options:
  --backup           Mit automatischem Backup
  --components-only  Nur Komponenten resetten  
  --full-reset       Komplettes Reset

Examples:
  npm run cli reset-update test-dashboard --backup
  npm run cli reset-update kunde-dashboard --components-only
  npm run cli reset-update firmen-dashboard --full-reset --backup
`);
    process.exit(0);
  }
  
  const projectName = args[0];
  const options = {
    backup: args.includes('--backup'),
    componentsOnly: args.includes('--components-only'),
    fullReset: args.includes('--full-reset')
  };
  
  return { projectName, options };
}

async function main() {
  const { projectName, options } = parseArguments();
  
  console.log('\n🛡️ Blueprint CLI - Reset-Update');
  console.log('═══════════════════════════════════');
  
  const success = await resetUpdate(projectName, options);
  process.exit(success ? 0 : 1);
}

main().catch(error => {
  console.error('❌ CLI Fehler:', error);
  process.exit(1);
}); 