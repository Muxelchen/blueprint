#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function copyDirectory(source, target) {
  await fs.promises.mkdir(target, { recursive: true });
  
  const entries = await fs.promises.readdir(source, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
    } else {
      await fs.promises.copyFile(sourcePath, targetPath);
    }
  }
}

async function resetUpdate(projectName, options = {}) {
  console.log(`🔄 Aktualisiere Projekt: ${projectName}`);
  
  const projectPath = path.join(process.cwd(), projectName);
  
  // Check if project exists
  if (!fs.existsSync(projectPath)) {
    console.error(`❌ Projekt "${projectName}" nicht gefunden!`);
    return false;
  }
  
  // Basic safety check - don't update main source directory
  if (projectName === 'src' || projectName === 'cli' || projectName === 'scripts') {
    console.error('🚨 FEHLER: Dieses Projekt ist geschützt und kann nicht aktualisiert werden!');
    console.error('🛡️  Blueprint-System darf nicht verändert werden.');
    return false;
  }
  
  try {
    // Create backup if requested
    if (options.backup) {
      console.log('📦 Erstelle Backup...');
      const backupDir = path.join(process.cwd(), '.blueprint-backup', `${projectName}-${Date.now()}`);
      await copyDirectory(projectPath, backupDir);
      console.log(`✅ Backup erstellt: ${backupDir}`);
    }
    
    if (options.componentsOnly) {
      console.log('🔧 Aktualisiere nur Komponenten...');
      
      // Copy essential components
      const componentsDir = path.join(projectPath, 'src', 'components');
      await fs.promises.mkdir(path.join(componentsDir, 'widgets'), { recursive: true });
      await fs.promises.mkdir(path.join(componentsDir, 'common'), { recursive: true });
      
      // Copy key widgets
      const widgetsToCopy = ['KPICard.tsx', 'BarChart.tsx', 'PieChart.tsx', 'DataTable.tsx'];
      for (const widget of widgetsToCopy) {
        const sourcePath = path.join(process.cwd(), 'src', 'components', 'widgets', widget);
        const targetPath = path.join(componentsDir, 'widgets', widget);
        if (fs.existsSync(sourcePath)) {
          await fs.promises.copyFile(sourcePath, targetPath);
          console.log(`   ✅ ${widget} aktualisiert`);
        }
      }
      
      // Copy common components
      const commonDirs = ['feedback', 'inputs', 'display'];
      for (const dir of commonDirs) {
        const sourceDir = path.join(process.cwd(), 'src', 'components', 'common', dir);
        const targetDir = path.join(componentsDir, 'common', dir);
        if (fs.existsSync(sourceDir)) {
          await copyDirectory(sourceDir, targetDir);
          console.log(`   ✅ common/${dir} aktualisiert`);
        }
      }
      
      // Update index files
      const widgetIndexContent = `// Widget Components
export { default as KPICard } from './KPICard';
export { default as BarChart } from './BarChart';
export { default as PieChart } from './PieChart';
export { default as DataTable } from './DataTable';`;
      
      await fs.promises.writeFile(
        path.join(componentsDir, 'widgets', 'index.ts'),
        widgetIndexContent
      );
      
    } else if (options.fullReset) {
      console.log('🔄 Führe komplettes Reset durch...');
      
      // Copy entire src structure (except App.tsx to preserve customizations)
      const srcDirs = ['components', 'types', 'utils', 'hooks'];
      for (const dir of srcDirs) {
        const sourceDir = path.join(process.cwd(), 'src', dir);
        const targetDir = path.join(projectPath, 'src', dir);
        if (fs.existsSync(sourceDir)) {
          await copyDirectory(sourceDir, targetDir);
          console.log(`   ✅ ${dir}/ aktualisiert`);
        }
      }
      
      // Update CSS
      const sourceCss = path.join(process.cwd(), 'src', 'index.css');
      const targetCss = path.join(projectPath, 'src', 'index.css');
      if (fs.existsSync(sourceCss)) {
        await fs.promises.copyFile(sourceCss, targetCss);
        console.log('   ✅ index.css aktualisiert');
      }
      
    } else {
      // Default: Smart update (components + styles)
      console.log('🔧 Führe Smart-Update durch...');
      
      // Copy components
      const componentsSource = path.join(process.cwd(), 'src', 'components');
      const componentsTarget = path.join(projectPath, 'src', 'components');
      if (fs.existsSync(componentsSource)) {
        await copyDirectory(componentsSource, componentsTarget);
        console.log('   ✅ Komponenten aktualisiert');
      }
      
      // Update CSS
      const sourceCss = path.join(process.cwd(), 'src', 'index.css');
      const targetCss = path.join(projectPath, 'src', 'index.css');
      if (fs.existsSync(sourceCss)) {
        await fs.promises.copyFile(sourceCss, targetCss);
        console.log('   ✅ Styles aktualisiert');
      }
      
      // Copy missing config files
      const configFiles = ['tsconfig.node.json'];
      for (const configFile of configFiles) {
        const sourceConfig = path.join(process.cwd(), configFile);
        const targetConfig = path.join(projectPath, configFile);
        if (fs.existsSync(sourceConfig) && !fs.existsSync(targetConfig)) {
          await fs.promises.copyFile(sourceConfig, targetConfig);
          console.log(`   ✅ ${configFile} hinzugefügt`);
        }
      }
    }
    
    console.log(`\n✅ Projekt "${projectName}" erfolgreich aktualisiert!`);
    console.log('💡 Tipp: Starten Sie das Projekt mit "npm run dev" um die Änderungen zu sehen.');
    return true;
    
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren:', error);
    return false;
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🔄 Blueprint Reset-Update Tool

Usage: node scripts/reset-update.js <project-name> [options]

Options:
  --backup           Backup vor Update erstellen
  --components-only  Nur Komponenten aktualisieren
  --full-reset       Komplettes Reset durchführen

Examples:
  node scripts/reset-update.js test-dashboard --backup
  node scripts/reset-update.js my-project --components-only
  node scripts/reset-update.js client-dashboard --full-reset --backup
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

// Main execution
async function main() {
  const { projectName, options } = parseArgs();
  
  console.log('\n🎨 Blueprint Reset-Update Tool');
  console.log('═══════════════════════════════════');
  
  const success = await resetUpdate(projectName, options);
  process.exit(success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unerwarteter Fehler:', error);
    process.exit(1);
  });
}

module.exports = { resetUpdate }; 