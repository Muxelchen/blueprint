#!/usr/bin/env node

import { DevErrorPrevention } from '../src/utils/DevErrorPrevention.js';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'check';

  switch (command) {
    case 'check':
      await DevErrorPrevention.runAllChecks();
      break;
    
    case 'fix':
      console.log('🔧 Creating missing component stubs...\n');
      await DevErrorPrevention.createComponentStubs();
      console.log('\n✅ Component stubs created. Run "npm run dev-check" to verify.');
      break;
    
    case 'help':
      console.log(`
Blueprint Dev Helper

Commands:
  check    - Run all development error checks (default)
  fix      - Create missing component stubs
  help     - Show this help message

Usage:
  npm run dev-check        # Run checks
  npm run dev-fix          # Create stubs
  npx tsx cli/dev-check.ts # Direct usage
      `);
      break;
    
    default:
      console.log(`Unknown command: ${command}. Use "help" for available commands.`);
  }
}

main().catch(console.error);