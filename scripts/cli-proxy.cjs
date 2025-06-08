#!/usr/bin/env node

// CLI Proxy script to handle "npm run cli reset-update" syntax
const { resetUpdate } = require('./reset-update.cjs');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
🎨 Blueprint CLI Commands

Available Commands:
  reset-update <project-name> [options]   Update project with Blueprint components

Reset-Update Options:
  --backup           Create backup before update
  --components-only  Update only components
  --full-reset       Complete reset

Examples:
  npm run cli reset-update test-dashboard -- --backup
  npm run cli reset-update kunde-dashboard -- --components-only
  npm run cli reset-update firmen-dashboard -- --full-reset --backup
`);
  process.exit(0);
}

const command = args[0];

if (command === 'reset-update') {
  // Handle reset-update command
  const projectName = args[1];
  
  if (!projectName) {
    console.error('❌ Project name required for reset-update command');
    console.log('Usage: npm run cli reset-update <project-name> -- [options]');
    process.exit(1);
  }
  
  // Parse all arguments to get flags
  const allArgs = process.argv.slice(2);
  const options = {
    backup: allArgs.includes('--backup'),
    componentsOnly: allArgs.includes('--components-only'),
    fullReset: allArgs.includes('--full-reset')
  };
  
  console.log('\n🛡️ Blueprint CLI - Reset-Update');
  console.log('═══════════════════════════════════');
  
  resetUpdate(projectName, options)
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('❌ CLI Fehler:', error);
      process.exit(1);
    });
    
} else {
  console.error(`❌ Unknown command: ${command}`);
  console.log('Available commands: reset-update');
  process.exit(1);
} 