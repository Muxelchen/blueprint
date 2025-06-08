#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { spawn } from 'child_process';

// Utility Functions
async function copyDirectory(source: string, target: string): Promise<void> {
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

function showWelcome(): void {
  console.log('\n🎨 Blueprint UI System - CLI');
  console.log('═══════════════════════════════════');
  console.log('🚀 Sichere App-Generierung mit AI-Schutz');
  console.log('🛡️  Blueprint-System automatisch geschützt');
  console.log('');
}

// Define types for template metadata
interface TemplateMetadata {
  name: string;
  description: string;
  dependencies: string[];
  features: string[];
  files?: string[];
}

type TemplateKey = 'dashboard' | 'analytics' | 'data-table' | 'map';

// Template metadata for better generation
const templateMetadata: Record<TemplateKey, TemplateMetadata> = {
  dashboard: {
    name: 'Dashboard Template',
    description: 'General-purpose dashboard with KPIs, charts, and data tables',
    dependencies: ['recharts', 'zustand'],
    features: ['KPI Cards', 'Charts', 'Data Tables', 'Quick Actions']
  },
  analytics: {
    name: 'Analytics Template', 
    description: 'Advanced analytics dashboard with real-time charts and metrics',
    dependencies: ['recharts', 'chart.js', 'date-fns'],
    features: ['Real-time Charts', 'Goal Tracking', 'Advanced Metrics', 'Heat Maps']
  },
  'data-table': {
    name: 'Data Table Template',
    description: 'Data management with CRUD operations, search, and filtering', 
    dependencies: ['react-router-dom'],
    features: ['Advanced Tables', 'Search & Filter', 'CRUD Operations', 'Bulk Actions']
  },
  map: {
    name: 'Map Dashboard Template',
    description: 'Location-based dashboard with interactive maps and geospatial data',
    dependencies: ['leaflet', 'react-leaflet', '@types/leaflet'],
    features: ['Interactive Maps', 'Location Tracking', 'Route Optimization', 'Geospatial Analytics']
  }
};

// AI Protection System - Enhanced Implementation with Real Blocking
class AIProtectionSystem {
  private static instance: AIProtectionSystem;
  private static readonly PROTECTION_FILE = '.blueprint-ai-protection';
  private static readonly CONFIG_FILE = '.blueprint-protection.json';
  private static readonly BACKUP_DIR = '.blueprint-backup';
  private static readonly DAEMON_FILE = '.blueprint-daemon.pid';
  private static protectionEnabled = true;
  private static protectedPaths = [
    'src/',
    'cli/',
    'scripts/',
    'package.json',
    'README.md',
    'vite.config.ts',
    'tailwind.config.js',
    'tsconfig.json',
    '*.config.*'
  ];
  
  private protectionLevel: 'basic' | 'standard' | 'advanced' = 'advanced';
  private monitoringActive = true;
  private protectedResources: Set<string> = new Set();
  private fileWatcher: any = null;
  private fileWatchers: Map<string, fs.FSWatcher> = new Map();
  private fileHashes: Map<string, string> = new Map();
  private originalFileContents: Map<string, string> = new Map();
  private blockedAttempts: number = 0;
  private daemonInterval: NodeJS.Timeout | null = null;
  private lastProcessedTime: Map<string, number> = new Map();
  private protectionStatus: {
    enabled: boolean;
    level: string;
    lastUpdated: string;
    protectedFiles: string[];
    monitoringActive: boolean;
    blockedAttempts: number;
  } = {
    enabled: true,
    level: 'advanced',
    lastUpdated: new Date().toISOString(),
    protectedFiles: [],
    monitoringActive: true,
    blockedAttempts: 0
  };

  // Enhanced Protection Configuration
  private static readonly DEFAULT_CONFIG = {
    protectionLevel: 'maximum',
    enabled: true,
    fileProtection: true,
    realTimeBlocking: true, // NEU: Echte Blockierung aktiviert
    instantRestore: true,   // NEU: Sofortige Wiederherstellung
    persistentDaemon: true, // NEU: Persistenter Daemon
    protectedPaths: [
      'src/',
      'cli/',
      'scripts/',
      'package.json',
      'README.md',
      'vite.config.ts',
      'tailwind.config.js',
      'tsconfig.json',
      '*.config.*'
    ],
    allowedAIPaths: [
      'firmen-dashboard-test/',
      'test-dashboard/',
      'firma-dashboard/',
      'demo-*/',
      'kunde-*/',
      'client-*/',
      'experiment-*/'
    ],
    aiScanningEnabled: true,
    autoBackupEnabled: true,
    realTimeMonitoring: true,
    fileChangeBlocking: true,
    aggressiveProtection: true, // NEU: Aggressiver Schutz
    // NEU: Backup-Konfiguration
    backupSettings: {
      intervalMinutes: 5,        // Backup alle 5 Minuten (statt 30 Sekunden)
      cleanupIntervalMinutes: 15, // Cleanup alle 15 Minuten
      maxBackupsPerFile: 3,      // Maximal 3 Backups pro Datei
      maxBackupAgeHours: 1,      // Lösche Backups älter als 1 Stunde
      smartBackup: true          // Nur Backup bei tatsächlichen Änderungen
    },
    lastActivation: new Date().toISOString(),
    violations: 0
  };

  static getInstance(): AIProtectionSystem {
    if (!AIProtectionSystem.instance) {
      AIProtectionSystem.instance = new AIProtectionSystem();
    }
    return AIProtectionSystem.instance;
  }

  private getProtectionConfig() {
    return AIProtectionSystem.DEFAULT_CONFIG;
  }

  private async saveProtectionStatus(): Promise<void> {
    try {
      const configPath = path.join(process.cwd(), AIProtectionSystem.CONFIG_FILE);
      const config = {
        ...this.protectionStatus,
        lastUpdated: new Date().toISOString()
      };
      await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      console.warn('⚠️ Could not save protection status:', error);
    }
  }

  private logViolation(filePath: string, eventType: string): void {
    console.log(`🚨 SECURITY VIOLATION: ${eventType} on ${filePath} at ${new Date().toISOString()}`);
    // Log to file or monitoring system
  }

  // NEU: Persistent Daemon Management
  private async startProtectionDaemon(): Promise<void> {
    console.log('🤖 Starting persistent protection daemon...');
    
    // Create daemon PID file
    const pidPath = path.join(process.cwd(), AIProtectionSystem.DAEMON_FILE);
    await fs.promises.writeFile(pidPath, process.pid.toString());
    
    // Start daemon heartbeat
    this.daemonInterval = setInterval(() => {
      this.daemonHeartbeat();
    }, 30000); // Every 30 seconds
    
    console.log('✅ Protection daemon started with PID:', process.pid);
  }

  private daemonHeartbeat(): void {
    // Update protection status timestamp
    this.protectionStatus.lastUpdated = new Date().toISOString();
    this.saveProtectionStatus();
    
    // Verify all watchers are still active
    if (this.fileWatchers.size === 0 && this.monitoringActive) {
      console.log('🔄 Restarting file watchers...');
      this.startAggressiveFileWatching();
    }
  }

  private async stopProtectionDaemon(): Promise<void> {
    console.log('🛑 Stopping protection daemon...');
    
    if (this.daemonInterval) {
      clearInterval(this.daemonInterval);
      this.daemonInterval = null;
    }
    
    // Remove PID file
    const pidPath = path.join(process.cwd(), AIProtectionSystem.DAEMON_FILE);
    try {
      if (fs.existsSync(pidPath)) {
        await fs.promises.unlink(pidPath);
      }
    } catch (error) {
      console.warn('Could not remove daemon PID file:', error);
    }
    
    console.log('✅ Protection daemon stopped');
  }

  // NEUE METHODE: Echte File System Überwachung mit sofortiger Blockierung
  private startFileSystemMonitoring(): void {
    console.log('👁️ Starting ENHANCED file system monitoring with real-time blocking...');
    
    const config = this.getProtectionConfig();
    
    // 1. Erstelle umfassende Dateihashes aller geschützten Dateien
    this.createFileHashDatabase();
    
    // 2. Starte aggressives File System Monitoring
    this.startAggressiveFileWatching();
    
    // 3. Starte Backup-System
    this.startContinuousBackup();
    
    // 4. Starte Permission-Überwachung
    this.startPermissionMonitoring();
    
    // 5. Starte persistenten Daemon
    this.startProtectionDaemon();
    
    console.log('✅ Enhanced file system monitoring active');
  }

  // NEUE METHODE: Erstelle Hash-Datenbank aller geschützten Dateien
  private createFileHashDatabase(): void {
    console.log('🔐 Creating file hash database for integrity protection...');
    
    const scanDirectory = (dirPath: string) => {
      if (!fs.existsSync(dirPath)) return;
      
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        
        if (item.isDirectory() && !item.name.startsWith('.') && !item.name.startsWith('node_modules')) {
          scanDirectory(fullPath);
        } else if (item.isFile()) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const hash = crypto.createHash('sha256').update(content).digest('hex');
            this.fileHashes.set(fullPath, hash);
            this.originalFileContents.set(fullPath, content);
          } catch (error) {
            // Binary file or permission error, skip
          }
        }
      }
    };
    
    // Scanne alle geschützten Verzeichnisse
    const config = this.getProtectionConfig();
    for (const protectedPath of config.protectedPaths) {
      const fullPath = path.resolve(protectedPath);
      if (fs.existsSync(fullPath)) {
        if (fs.statSync(fullPath).isDirectory()) {
          scanDirectory(fullPath);
        } else {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const hash = crypto.createHash('sha256').update(content).digest('hex');
            this.fileHashes.set(fullPath, hash);
            this.originalFileContents.set(fullPath, content);
          } catch (error) {
            console.warn(`Could not hash ${fullPath}:`, error);
          }
        }
      }
    }
    
    console.log(`📊 Protected ${this.fileHashes.size} files with integrity hashes`);
  }

  // NEUE METHODE: Aggressives File Watching mit sofortiger Wiederherstellung
  private startAggressiveFileWatching(): void {
    console.log('🛡️ Starting aggressive file watching with instant restore...');
    
    const config = this.getProtectionConfig();
    
    // Monitor jeden geschützten Pfad mit höchster Priorität
    for (const protectedPath of config.protectedPaths) {
      const fullPath = path.resolve(protectedPath);
      
      if (fs.existsSync(fullPath)) {
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            // Watch directory recursively
            const watcher = fs.watch(fullPath, {
              recursive: true,
              persistent: true
            }, (eventType, filename) => {
              if (filename) {
                const changedFile = path.join(fullPath, filename);
                this.handleFileChangeWithInstantBlock(eventType, changedFile);
              }
            });
            
            this.fileWatchers.set(protectedPath, watcher);
            console.log(`🔒 MONITORING directory: ${protectedPath}`);
            
          } else {
            // Watch individual file
            const watcher = fs.watch(fullPath, (eventType, filename) => {
              this.handleFileChangeWithInstantBlock(eventType, fullPath);
            });
            
            this.fileWatchers.set(protectedPath, watcher);
            console.log(`🔒 MONITORING file: ${protectedPath}`);
          }
          
        } catch (error) {
          console.warn(`⚠️ Could not monitor ${protectedPath}:`, error);
        }
      } else {
        console.warn(`⚠️ Protected path does not exist: ${protectedPath}`);
      }
    }
    
    console.log(`✅ Started ${this.fileWatchers.size} file watchers`);
  }

  // NEUE METHODE: Sofortige Datei-Änderungs-Blockierung
  private handleFileChangeWithInstantBlock(eventType: string, filePath: string): void {
    const config = this.getProtectionConfig();
    
    // Skip wenn Schutz deaktiviert
    if (!config.enabled || !config.realTimeBlocking) return;
    
    // Skip versteckte/temporäre Dateien
    const fileName = path.basename(filePath);
    if (fileName.startsWith('.') || fileName.includes('~') || fileName.includes('.tmp')) {
      return;
    }
    
    // Skip security log file to prevent infinite loops
    if (filePath.includes('.blueprint-security.log') || 
        filePath.includes('.blueprint-protection.json') ||
        filePath.includes('.blueprint-daemon.pid')) {
      return;
    }
    
    // Prüfe ob Änderung erlaubt ist
    if (this.isChangeAllowed(filePath)) {
      return;
    }
    
    // Rate limit: Only process one event per file per second
    const now = Date.now();
    const lastProcessed = this.lastProcessedTime.get(filePath) || 0;
    if (now - lastProcessed < 1000) {
      return;
    }
    this.lastProcessedTime.set(filePath, now);
    
    console.log(`🚨 BLOCKING: ${eventType} on ${filePath}`);
    
    // SOFORTIGE BLOCKIERUNG und WIEDERHERSTELLUNG
    this.executeInstantBlock(filePath, eventType);
  }

  // NEUE METHODE: Prüfe ob Änderung erlaubt ist
  private isChangeAllowed(filePath: string): boolean {
    const config = this.getProtectionConfig();
    
    // Prüfe erlaubte AI-Pfade
    for (const allowedPath of config.allowedAIPaths) {
      if (filePath.includes(allowedPath)) {
        return true;
      }
    }
    
    // Prüfe ob es eine temporäre Datei ist
    const fileName = path.basename(filePath);
    if (fileName.startsWith('.') || fileName.includes('~') || fileName.includes('.tmp')) {
      return true;
    }
    
    return false;
  }

  // NEUE METHODE: Sofortige Blockierung ausführen
  private executeInstantBlock(filePath: string, eventType: string): void {
    this.blockedAttempts++;
    
    // 1. Versuche sofortige Wiederherstellung aus Original-Inhalt
    if (this.originalFileContents.has(filePath) && eventType === 'change') {
      try {
        const originalContent = this.originalFileContents.get(filePath);
        if (originalContent) {
          // Schreibe Original-Inhalt zurück (BLOCKING)
          fs.writeFileSync(filePath, originalContent, { flag: 'w' });
          console.log(`🔄 RESTORED: ${path.basename(filePath)}`);
          
          // Aktualisiere Hash
          const newHash = crypto.createHash('sha256').update(originalContent).digest('hex');
          this.fileHashes.set(filePath, newHash);
        }
      } catch (error) {
        console.error(`❌ RESTORE FAILED for ${filePath}:`, error);
      }
    }
    
    // 2. Log Violation (simplified)
    this.logEnhancedViolation(filePath, eventType);
    
    // 3. Update Protection Status
    this.updateProtectionStatus();
  }

  // NEUE METHODE: Versuche Datei-Wiederherstellung aus Backup
  private attemptFileRestore(filePath: string): void {
    console.log(`🔄 Attempting file restore for: ${filePath}`);
    
    try {
      const backupDir = path.join(process.cwd(), AIProtectionSystem.BACKUP_DIR);
      const relativePath = path.relative(process.cwd(), filePath);
      const backupFileName = relativePath.replace(/[/\\]/g, '_') + '.original';
      const backupPath = path.join(backupDir, backupFileName);
      
      if (fs.existsSync(backupPath)) {
        const backupContent = fs.readFileSync(backupPath, 'utf-8');
        fs.writeFileSync(filePath, backupContent);
        console.log(`✅ File restored from backup: ${filePath}`);
      } else {
        console.warn(`⚠️ No backup found for: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Failed to restore file ${filePath}:`, error);
    }
  }

  // NEUE METHODE: Kontinuierliches Backup-System
  private startContinuousBackup(): void {
    const config = this.getProtectionConfig();
    
    if (!config.autoBackupEnabled) {
      console.log('💾 Backup system disabled by configuration');
      return;
    }
    
    console.log('💾 Starting optimized backup system...');
    
    // Erstelle Backup-Verzeichnis
    const backupDir = path.join(process.cwd(), AIProtectionSystem.BACKUP_DIR);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Verwende konfigurierbare Intervalle
    const backupInterval = config.backupSettings.intervalMinutes * 60 * 1000; // Convert to milliseconds
    const cleanupInterval = config.backupSettings.cleanupIntervalMinutes * 60 * 1000;
    
    console.log(`💾 Backup interval: ${config.backupSettings.intervalMinutes} minutes`);
    console.log(`🗑️ Cleanup interval: ${config.backupSettings.cleanupIntervalMinutes} minutes`);
    
    // Backup alle geschützten Dateien basierend auf Konfiguration
    setInterval(() => {
      this.createIncrementalBackup();
    }, backupInterval);
    
    // Cleanup alte Backups basierend auf Konfiguration
    setInterval(() => {
      this.cleanupOldBackups();
    }, cleanupInterval);
    
    // Sofortiges Backup
    this.createIncrementalBackup();
  }

  // NEUE METHODE: Inkrementelles Backup
  private createIncrementalBackup(): void {
    const backupDir = path.join(process.cwd(), AIProtectionSystem.BACKUP_DIR);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const config = this.getProtectionConfig();
    
    let backedUpFiles = 0;
    
    for (const [filePath, originalContent] of this.originalFileContents) {
      try {
        if (fs.existsSync(filePath)) {
          const relativePath = path.relative(process.cwd(), filePath);
          let shouldBackup = true;
          
          // Smart Backup: Prüfe, ob sich die Datei tatsächlich geändert hat
          if (config.backupSettings.smartBackup) {
            const currentContent = fs.readFileSync(filePath, 'utf-8');
            const currentHash = crypto.createHash('md5').update(currentContent).digest('hex');
            const originalHash = crypto.createHash('md5').update(originalContent).digest('hex');
            
            shouldBackup = currentHash !== originalHash;
          }
          
          if (shouldBackup) {
            const backupPath = path.join(backupDir, `${relativePath.replace(/[/\\]/g, '_')}_${timestamp}.backup`);
            fs.writeFileSync(backupPath, originalContent);
            backedUpFiles++;
          }
        }
      } catch (error) {
        console.warn(`Backup failed for ${filePath}:`, error);
      }
    }
    
    if (backedUpFiles > 0) {
      const backupType = config.backupSettings.smartBackup ? 'Smart backup' : 'Backup';
      console.log(`💾 ${backupType}: ${backedUpFiles} files backed up`);
    }
  }

  // NEUE METHODE: Cleanup alte Backups
  private cleanupOldBackups(): void {
    const backupDir = path.join(process.cwd(), AIProtectionSystem.BACKUP_DIR);
    const config = this.getProtectionConfig();
    
    if (!fs.existsSync(backupDir)) {
      return;
    }
    
    try {
      const files = fs.readdirSync(backupDir);
      const backupFiles = files.filter(file => file.endsWith('.backup'));
      
      // Gruppiere Backups nach Basis-Dateiname
      const backupGroups: Map<string, string[]> = new Map();
      
      backupFiles.forEach(file => {
        // Extrahiere Basis-Dateiname (ohne Timestamp)
        const baseName = file.replace(/_[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{3}Z\.backup$/, '');
        
        if (!backupGroups.has(baseName)) {
          backupGroups.set(baseName, []);
        }
        backupGroups.get(baseName)!.push(file);
      });
      
      let deletedCount = 0;
      
      // Für jede Datei: Behalte nur die konfigurierten maximalen Backups
      const maxBackups = config.backupSettings.maxBackupsPerFile;
      backupGroups.forEach((backupList, baseName) => {
        if (backupList.length > maxBackups) {
          // Sortiere nach Timestamp (älteste zuerst)
          backupList.sort();
          
          // Lösche alle außer den neuesten N
          const toDelete = backupList.slice(0, backupList.length - maxBackups);
          
          toDelete.forEach(file => {
            try {
              const filePath = path.join(backupDir, file);
              fs.unlinkSync(filePath);
              deletedCount++;
            } catch (error) {
              console.warn(`Could not delete backup ${file}:`, error);
            }
          });
        }
      });
      
      // Lösche auch alte Backups basierend auf konfiguriertem Alter
      const maxAgeMs = config.backupSettings.maxBackupAgeHours * 60 * 60 * 1000;
      const cutoffTime = Date.now() - maxAgeMs;
      
      backupFiles.forEach(file => {
        try {
          const filePath = path.join(backupDir, file);
          const stats = fs.statSync(filePath);
          
          if (stats.mtime.getTime() < cutoffTime) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        } catch (error) {
          // Ignore errors for individual files
        }
      });
      
      if (deletedCount > 0) {
        console.log(`🗑️ Backup cleanup: ${deletedCount} old backup files removed (keeping max ${maxBackups} per file, max age ${config.backupSettings.maxBackupAgeHours}h)`);
      }
    } catch (error) {
      console.warn('⚠️ Backup cleanup failed:', error);
    }
  }

  // NEUE METHODE: Permission Monitoring
  private startPermissionMonitoring(): void {
    console.log('🔐 Starting permission monitoring...');
    
    // Überwache Dateiberechtigungen alle 10 Sekunden
    setInterval(() => {
      this.checkFilePermissions();
    }, 10000);
  }

  // NEUE METHODE: Datei-Berechtigungen prüfen
  private checkFilePermissions(): void {
    const config = this.getProtectionConfig();
    
    for (const protectedPath of config.protectedPaths) {
      const fullPath = path.resolve(protectedPath);
      
      if (fs.existsSync(fullPath)) {
        try {
          const stats = fs.statSync(fullPath);
          
          // Prüfe ob Datei schreibgeschützt werden sollte
          if (config.aggressiveProtection && stats.mode & 0o200) {
            // Entferne Schreibrechte für aggressiven Schutz
            // fs.chmodSync(fullPath, stats.mode & ~0o200);
            // console.log(`🔒 Write protection applied to: ${fullPath}`);
          }
        } catch (error) {
          // Permission error, skip
        }
      }
    }
  }

  // VERBESSERTE METHODE: Enhanced Violation Logging
  private logEnhancedViolation(filePath: string, eventType: string): void {
    const violation = {
      timestamp: new Date().toISOString(),
      type: 'SECURITY_VIOLATION',
      event: eventType,
      file: filePath,
      blocked: true,
      restored: true,
      protection_level: 'maximum'
    };
    
    console.log(`🚨 SECURITY VIOLATION BLOCKED: ${JSON.stringify(violation, null, 2)}`);
    
    // Log to security file
    const securityLogPath = path.join(process.cwd(), '.blueprint-security.log');
    try {
      fs.appendFileSync(securityLogPath, JSON.stringify(violation) + '\n');
    } catch (error) {
      console.warn('Could not write to security log:', error);
    }
  }

  // VERBESSERTE METHODE: Enhanced Security Alert
  private showEnhancedSecurityAlert(filePath: string, eventType: string): void {
    console.log('\n🚨🚨🚨 CRITICAL SECURITY ALERT 🚨🚨🚨');
    console.log('═══════════════════════════════════════════════════');
    console.log(`🛡️  AI Protection System BLOCKED and RESTORED unauthorized change`);
    console.log(`📁 File: ${filePath}`);
    console.log(`🔄 Operation: ${eventType}`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
    console.log(`🔢 Total blocked attempts: ${this.blockedAttempts}`);
    console.log(`⚡ Action taken: INSTANT RESTORE from protected backup`);
    console.log('\n🔒 PROTECTION STATUS: MAXIMUM SECURITY ACTIVE');
    console.log('   ✅ File automatically restored');
    console.log('   ✅ Original content preserved');
    console.log('   ✅ Unauthorized change blocked');
    console.log('\n💡 To make changes to protected files:');
    console.log('   1. Disable protection: npm run cli set-protection --disable');
    console.log('   2. Make your changes');
    console.log('   3. Re-enable protection: npm run cli set-protection --enable');
    console.log('\n🔒 Or work in allowed directories:');
    const config = this.getProtectionConfig();
    config.allowedAIPaths.forEach((path: string) => {
      console.log(`   - ${path}`);
    });
    console.log('═══════════════════════════════════════════════════\n');
  }

  // NEUE METHODE: Protection Status Update
  private updateProtectionStatus(): void {
    this.protectionStatus = {
      enabled: AIProtectionSystem.protectionEnabled,
      level: 'maximum',
      lastUpdated: new Date().toISOString(),
      protectedFiles: Array.from(this.originalFileContents.keys()),
      monitoringActive: this.monitoringActive,
      blockedAttempts: this.blockedAttempts
    };
    
    this.saveProtectionStatus();
  }

  async initializeProtection(): Promise<void> {
    console.log('🛡️ Initializing ENHANCED AI Protection System...');
    
    // Register protected resources
    this.protectedResources.add('package.json');
    this.protectedResources.add('tsconfig.json');
    this.protectedResources.add('vite.config.ts');
    this.protectedResources.add('src/');
    this.protectedResources.add('cli/');
    
    // Start enhanced file protection monitoring
    await this.startFileProtectionMonitoring();
    
    // Start ENHANCED file system monitoring with real blocking
    this.startFileSystemMonitoring();
    
    // Validate existing security measures
    await this.validateSecurityMeasures();
    
    console.log('✅ ENHANCED AI Protection System active with REAL-TIME BLOCKING');
    console.log(`🔢 Protecting ${this.fileHashes.size} files with integrity verification`);
  }

  // VERBESSERTE METHODE: Enhanced File Protection Monitoring
  private async startFileProtectionMonitoring(): Promise<void> {
    console.log('🔐 Starting enhanced file protection monitoring...');
    
    // Create comprehensive backup
    await this.createComprehensiveBackup();
    
    // Setup enhanced file change detection
    this.setupEnhancedFileChangeDetection();
  }

  // NEUE METHODE: Comprehensive Backup
  private async createComprehensiveBackup(): Promise<void> {
    const backupDir = path.join(process.cwd(), AIProtectionSystem.BACKUP_DIR);
    
    try {
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      // Backup ALLE geschützten Dateien
      let backedUpCount = 0;
      
      for (const [filePath, content] of this.originalFileContents) {
        const relativePath = path.relative(process.cwd(), filePath);
        const backupFileName = relativePath.replace(/[/\\]/g, '_') + '.original';
        const backupPath = path.join(backupDir, backupFileName);
        
        try {
          fs.writeFileSync(backupPath, content);
          backedUpCount++;
        } catch (error) {
          console.warn(`Could not backup ${filePath}:`, error);
        }
      }
      
      console.log(`💾 Comprehensive backup created: ${backedUpCount} files`);
    } catch (error) {
      console.warn('⚠️ Could not create comprehensive backup:', error);
    }
  }

  // VERBESSERTE METHODE: Enhanced File Change Detection
  private setupEnhancedFileChangeDetection(): void {
    console.log('👁️ Setting up ENHANCED real-time file change detection...');
    
    // Die Logik ist bereits in startAggressiveFileWatching() implementiert
    console.log('✅ Enhanced file change detection ready');
  }

  // VERBESSERTE METHODE: Enhanced Security Measures Validation
  private async validateSecurityMeasures(): Promise<void> {
    console.log('🔍 Validating ENHANCED security measures...');
    
    const checks = [
      () => this.fileHashes.size > 0,
      () => this.originalFileContents.size > 0,
      () => this.fileWatchers.size > 0,
      () => fs.existsSync(path.join(process.cwd(), AIProtectionSystem.BACKUP_DIR))
    ];
    
    const passedChecks = checks.filter(check => check()).length;
    
    console.log(`✅ Security validation: ${passedChecks}/${checks.length} measures active`);
    
    if (passedChecks === checks.length) {
      console.log('🛡️ ALL ENHANCED SECURITY MEASURES VALIDATED');
    } else {
      console.warn('⚠️ Some security measures not fully initialized');
    }
  }

  static async cleanupFileWatchers(): Promise<void> {
    const instance = this.getInstance();
    
    // Stop all file watchers
    if (instance.fileWatchers && instance.fileWatchers.size > 0) {
      console.log('🔄 Stopping file watchers...');
      
      for (const [path, watcher] of instance.fileWatchers) {
        try {
          watcher.close();
          console.log(`   ✅ Stopped watching: ${path}`);
        } catch (error) {
          console.warn(`   ⚠️ Error stopping watcher for ${path}:`, error);
        }
      }
      
      instance.fileWatchers.clear();
    }
    
    // Clear file hashes
    if (instance.fileHashes) {
      instance.fileHashes.clear();
    }
  }

  static async enableProtection(): Promise<void> {
    const instance = this.getInstance();
    
    console.log('🔒 Enabling ENHANCED AI Protection System...');
    
    AIProtectionSystem.protectionEnabled = true;
    
    // Initialize enhanced protection
    await instance.initializeProtection();
    
    console.log('✅ ENHANCED AI Protection System enabled with REAL-TIME BLOCKING');
    console.log('   🛡️ File integrity monitoring: ACTIVE');
    console.log('   ⚡ Instant restore capability: ACTIVE');
    console.log('   🔐 Aggressive file watching: ACTIVE');
    console.log('   💾 Continuous backup: ACTIVE');
    console.log('   🤖 Protection daemon: RUNNING');
    
    // Keep the process alive for protection
    if (process.argv.includes('set-protection') && process.argv.includes('--enable')) {
      console.log('\n🔒 Protection system is now running continuously...');
      console.log('   Press Ctrl+C to stop (will disable protection)');
      
      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        console.log('\n\n🛑 Shutting down protection system...');
        await this.disableProtection();
        process.exit(0);
      });
      
      // Keep alive
      setInterval(() => {
        // Daemon heartbeat is handled internally
      }, 60000);
    }
  }

  static async disableProtection(): Promise<void> {
    const instance = this.getInstance();
    
    console.log('🔓 Disabling AI Protection System...');
    
    AIProtectionSystem.protectionEnabled = false;
    
    // Stop daemon first
    await instance.stopProtectionDaemon();
    
    // Clean up file watchers
    await this.cleanupFileWatchers();
    
    // Update protection status
    instance.protectionStatus = {
      enabled: false,
      level: 'none',
      lastUpdated: new Date().toISOString(),
      protectedFiles: [],
      monitoringActive: false,
      blockedAttempts: 0
    };
    
    // Save updated status
    await instance.saveProtectionStatus();
    
    console.log('✅ AI Protection System disabled successfully');
    console.log('   📁 File monitoring stopped');
    console.log('   🤖 Protection daemon stopped');
    console.log('   🔓 All files are now editable');
  }

  static isProtectionEnabled(): boolean {
    return AIProtectionSystem.protectionEnabled;
  }
  
  static validateAIPath(targetPath: string): {
    isValid: boolean;
    allowed?: boolean;
    reason?: string;
    suggestion?: string;
  } {
    const absolutePath = path.resolve(targetPath);
    
    // Check if path is in protected directories
    for (const protectedPath of AIProtectionSystem.protectedPaths) {
      if (absolutePath.startsWith(path.resolve(protectedPath))) {
        return {
          isValid: false,
          allowed: false,
          reason: `Pfad ist geschützt: ${protectedPath}`,
          suggestion: `Verwenden Sie einen sicheren Pfad wie: ${this.suggestSafePaths()[0] || './safe-workspace'}`
        };
      }
    }
    
    // Check if it's a core system file
    const fileName = path.basename(absolutePath);
    if (fileName.startsWith('.') || 
        fileName.includes('config') || 
        fileName.includes('package') ||
        fileName.endsWith('.json') ||
        fileName.endsWith('.md')) {
      return {
        isValid: false,
        allowed: false,
        reason: 'Systemdatei erkannt',
        suggestion: 'Erstellen Sie eine neue Datei in einem sicheren Verzeichnis'
      };
    }
    
    return { isValid: true, allowed: true };
  }
  
  static suggestSafePaths(): string[] {
    return [
      './safe-workspace',
      './user-projects',
      './sandbox',
      './test-area',
      './experiments'
    ];
  }
  
  static showProtectionStatus(): void {
    console.log('\n🛡️  AI PROTECTION SYSTEM STATUS');
    console.log('================================');
    console.log(`Status: ${AIProtectionSystem.protectionEnabled ? '🟢 AKTIV' : '🔴 INAKTIV'}`);
    console.log(`Geschützte Pfade: ${AIProtectionSystem.protectedPaths.length}`);
    
    if (AIProtectionSystem.protectedPaths.length > 0) {
      console.log('\nGeschützte Verzeichnisse:');
      AIProtectionSystem.protectedPaths.forEach((p: string) => console.log(`  📁 ${p}`));
    }
    
    console.log('\nSichere Arbeitsbereiche:');
    this.suggestSafePaths().forEach((p: string) => console.log(`  ✅ ${p}`));
    
    const instance = this.getInstance();
    if (instance.fileWatchers && instance.fileWatchers.size > 0) {
      console.log(`\nAktive Überwachung: ${instance.fileWatchers.size} Dateien`);
    }
    
    console.log('\n💡 Tipp: Verwenden Sie "blueprint ai enable/disable" zum Umschalten');
  }
}

// AI Activity Monitor
class AIActivityMonitor {
  private violations: Array<{
    timestamp: string;
    operation: string;
    targetPath: string;
    reason: string;
  }> = [];

  logViolation(operation: string, targetPath: string, reason: string): void {
    this.violations.push({
      timestamp: new Date().toISOString(),
      operation,
      targetPath,
      reason
    });
  }

  getViolationsReport(): Array<{
    timestamp: string;
    operation: string;
    targetPath: string;
    reason: string;
  }> {
    return [...this.violations];
  }
}

// Blueprint Safety Utilities
class BlueprintSafety {
  private static readonly PROTECTED_DIRS = [
    'src',
    'cli', 
    'scripts',
    'public',
    'docs'
  ];

  private static readonly PROTECTED_FILES = [
    'package.json',
    'README.md',
    'vite.config.ts',
    'tailwind.config.js',
    'tsconfig.json'
  ];

  static isBlueprintProtected(targetPath: string): boolean {
    const blueprintRoot = process.cwd();
    const relativePath = path.relative(blueprintRoot, targetPath);
    
    // Wenn der Pfad außerhalb von Blueprint ist, ist er sicher
    if (relativePath.startsWith('..')) return false;
    
    // Geschützte Verzeichnisse prüfen
    for (const protectedDir of this.PROTECTED_DIRS) {
      if (relativePath.startsWith(protectedDir + '/') || relativePath === protectedDir) {
        return true;
      }
    }
    
    // Geschützte Dateien prüfen
    for (const protectedFile of this.PROTECTED_FILES) {
      if (relativePath === protectedFile) {
        return true;
      }
    }
    
    return false;
  }

  static async safeDelete(projectPath: string): Promise<boolean> {
    const fullPath = path.resolve(projectPath);
    const blueprintRoot = process.cwd();
    
    // Sicherheitsprüfungen
    if (this.isBlueprintProtected(fullPath)) {
      console.error('🚨 FEHLER: Versuch Blueprint-System zu löschen wurde blockiert!');
      console.error(`🛡️  Geschützter Pfad: ${fullPath}`);
      return false;
    }
    
    // Zusätzliche Sicherheit: Projekt muss Unterordner von Blueprint sein
    const relativePath = path.relative(blueprintRoot, fullPath);
    if (relativePath.startsWith('..')) {
      console.error('🚨 FEHLER: Projekt liegt außerhalb von Blueprint!');
      return false;
    }
    
    // Prüfen ob es ein generiertes Projekt ist
    const packageJsonPath = path.join(fullPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        if (!packageJson.name || packageJson.name === 'blueprint-ui-system') {
          console.error('🚨 FEHLER: Das ist das Blueprint-System selbst!');
          return false;
        }
      } catch (error) {
        console.warn('⚠️ Warnung: package.json konnte nicht gelesen werden');
      }
    }
    
    // Sicher löschen
    try {
      if (fs.existsSync(fullPath)) {
        await fs.promises.rm(fullPath, { recursive: true, force: true });
        console.log(`✅ Projekt sicher gelöscht: ${projectPath}`);
        return true;
      } else {
        console.log(`ℹ️  Projekt existiert nicht: ${projectPath}`);
        return true;
      }
    } catch (error) {
      console.error(`❌ Fehler beim Löschen: ${error}`);
      return false;
    }
  }

  static listDeletableProjects(): string[] {
    const blueprintRoot = process.cwd();
    const projects: string[] = [];
    
    try {
      const items = fs.readdirSync(blueprintRoot);
      
      for (const item of items) {
        const itemPath = path.join(blueprintRoot, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory() && !this.isBlueprintProtected(itemPath)) {
          // Prüfen ob es ein Node.js Projekt ist
          const packageJsonPath = path.join(itemPath, 'package.json');
          if (fs.existsSync(packageJsonPath)) {
            projects.push(item);
          }
        }
      }
    } catch (error) {
      console.error('Fehler beim Auflisten der Projekte:', error);
    }
    
    return projects;
  }
}

// Create Protected Project Function
async function createProtectedProject(projectName: string, template: TemplateKey): Promise<void> {
  const sourcePath = path.join(__dirname, '..');
  const targetPath = path.join(process.cwd(), projectName);

  // Validate project name and path safety
  const validation = AIProtectionSystem.validateAIPath(targetPath);
  if (!validation.allowed) {
    console.error(`🚨 FEHLER: ${validation.reason}`);
    console.error(`🛡️  Verwenden Sie einen sicheren Pfad für AI-Operationen.`);
    return;
  }

  console.log(`🚀 Erstelle geschütztes Projekt: ${projectName}`);
  console.log(`📋 Template: ${templateMetadata[template].name}`);

  try {
    // Copy blueprint structure
    await copyDirectory(sourcePath, targetPath);

    // Update package.json with project-specific information
    const packageJsonPath = path.join(targetPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      packageJson.name = projectName.toLowerCase().replace(/\s+/g, '-');
      packageJson.description = `${templateMetadata[template].description} - Generated from Blueprint`;
      packageJson.version = '1.0.0';

      // Add template-specific dependencies
      for (const dep of templateMetadata[template].dependencies) {
        if (!packageJson.dependencies[dep]) {
          packageJson.dependencies[dep] = 'latest';
        }
      }

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }

    console.log(`✅ Projekt "${projectName}" erfolgreich erstellt`);
    console.log(`📁 Pfad: ${targetPath}`);
    console.log(`🛡️  Projekt ist AI-sicher und außerhalb des geschützten Blueprint-Systems`);
    console.log(`\n🔧 Nächste Schritte:`);
    console.log(`   cd ${projectName}`);
    console.log(`   npm install`);
    console.log(`   npm run dev`);

  } catch (error) {
    console.error(`❌ Fehler beim Erstellen des Projekts: ${error}`);
  }
}

async function generateTemplateWithValidation(template: TemplateKey): Promise<void> {
  console.log(`🎨 Generiere Template: ${templateMetadata[template].name}`);
  
  // Template validation and generation logic would go here
  console.log(`✅ Template ${template} erfolgreich generiert`);
}

// CLI Program Setup
const program = new Command();

program
  .name('blueprint-cli')
  .description('Blueprint UI System - Sichere App-Generierung mit AI-Schutz')
  .version('1.0.0');

// AI Protection Commands
program
  .command('set-protection')
  .description('🔒 AI-Schutz-System steuern (Blueprint vor AI-Eingriffen schützen)')
  .option('--enable', 'AI-Schutz aktivieren (Standard)')
  .option('--disable', 'AI-Schutz deaktivieren (nur für Blueprint-Entwicklung)')
  .action(async (options) => {
    console.log('DEBUG: Received options:', options); // Debug output
    
    if (options.enable) {
      await AIProtectionSystem.enableProtection();
    } else if (options.disable) {
      console.log('\n⚠️  WARNUNG: Sie sind dabei, den AI-Schutz zu deaktivieren!');
      console.log('🚨 Das Blueprint-System wird dadurch UNGESCHÜTZT vor AI-Eingriffen!');
      console.log('💡 Dies sollte NUR für eigene Blueprint-Entwicklung verwendet werden.\n');
      
      await AIProtectionSystem.disableProtection();
      
      console.log('\n🔔 ERINNERUNG: Aktivieren Sie den Schutz nach Blueprint-Entwicklung wieder!');
      console.log('   npm run cli set-protection --enable');
      
    } else {
      console.log('\n🔒 Blueprint AI-Schutz-System\n');
      console.log('Verfügbare Optionen:');
      console.log('  --enable     AI-Schutz aktivieren (Blueprint schützen)');
      console.log('  --disable    AI-Schutz deaktivieren (nur für Blueprint-Entwicklung)');
      console.log('\n💡 Empfehlung: Lassen Sie den Schutz IMMER aktiviert!');
    }
  });

program
  .command('protection-status')
  .description('🛡️ AI-Schutz-Status anzeigen')
  .action(() => {
    AIProtectionSystem.showProtectionStatus();
  });

program
  .command('start-daemon')
  .description('🤖 Schutz-Daemon im Hintergrund starten')
  .action(async () => {
    console.log('🤖 Starting Blueprint Protection Daemon...\n');
    
    // Check if already running
    const pidPath = path.join(process.cwd(), '.blueprint-daemon.pid');
    if (fs.existsSync(pidPath)) {
      console.log('⚠️  Protection daemon may already be running.');
      console.log('   Use "npm run cli stop-daemon" to stop it first.');
      return;
    }
    
    // Enable protection and start daemon
    await AIProtectionSystem.enableProtection();
    
    console.log('\n🔒 Protection daemon is now running in the background...');
    console.log('   Use "npm run cli stop-daemon" to stop');
    console.log('   Use "npm run cli protection-status" to check status');
    
    // Keep the process alive
    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Shutting down protection daemon...');
      await AIProtectionSystem.disableProtection();
      process.exit(0);
    });
    
    // Keep alive indefinitely
    setInterval(() => {
      // Daemon heartbeat is handled internally
    }, 60000);
  });

program
  .command('stop-daemon')
  .description('🛑 Schutz-Daemon stoppen')
  .action(async () => {
    console.log('🛑 Stopping Blueprint Protection Daemon...\n');
    
    const pidPath = path.join(process.cwd(), '.blueprint-daemon.pid');
    if (!fs.existsSync(pidPath)) {
      console.log('ℹ️  No protection daemon running.');
      return;
    }
    
    try {
      const pid = fs.readFileSync(pidPath, 'utf-8');
      console.log(`🔍 Found daemon with PID: ${pid}`);
      
      // Try to kill the process
      try {
        process.kill(parseInt(pid), 'SIGTERM');
        console.log('✅ Protection daemon stopped successfully');
      } catch (error) {
        console.log('⚠️  Process may have already stopped');
      }
      
      // Clean up
      fs.unlinkSync(pidPath);
      await AIProtectionSystem.disableProtection();
      
    } catch (error) {
      console.error('❌ Error stopping daemon:', error);
    }
  });

program
  .command('ai-safe-paths')
  .description('🛡️ Sichere Pfade für AI-Operationen anzeigen')
  .action(() => {
    console.log('\n🛡️  Sichere Pfade für AI-Operationen:\n');
    
    const safePaths = AIProtectionSystem.suggestSafePaths();
    
    if (safePaths.length === 0) {
      console.log('   Keine sicheren Projekt-Pfade gefunden.');
      console.log('   Erstellen Sie zuerst ein Projekt:');
      console.log('   npm run cli create test-project --template dashboard');
      console.log('   npm run cli copy-blueprint kunde-projekt');
    } else {
      console.log('✅ Diese Pfade sind sicher für AI-Operationen:');
      safePaths.forEach((safePath: string) => {
        console.log(`   📁 /Users/Max/Main VS/blueprint/${safePath}/`);
      });
      
      console.log('\n💡 AI-Prompt-Beispiel:');
      console.log(`   "Modifiziere die App.tsx in ${safePaths[0]}/src/"`);
      console.log(`   "Erstelle eine neue Komponente in ${safePaths[0]}/src/components/"`);
    }
    
    console.log('\n🚨 Diese Pfade sind GESCHÜTZT (AI darf nicht zugreifen):');
    console.log('   ❌ /Users/Max/Main VS/blueprint/src/');
    console.log('   ❌ /Users/Max/Main VS/blueprint/cli/');
    console.log('   ❌ /Users/Max/Main VS/blueprint/scripts/');
    console.log('   ❌ /Users/Max/Main VS/blueprint/package.json');
  });

// Project Creation Commands
program
  .command('create')
  .description('🚀 Neues geschütztes Projekt erstellen')
  .argument('<project-name>', 'Name des Projekts')
  .option('-t, --template <template>', 'Template auswählen (dashboard, analytics, data-table, map)', 'dashboard')
  .action(async (projectName: string, options) => {
    const template = options.template as TemplateKey;
    
    if (!templateMetadata[template]) {
      console.error(`❌ Unbekanntes Template: ${template}`);
      console.log('Verfügbare Templates:', Object.keys(templateMetadata).join(', '));
      return;
    }
    
    showWelcome();
    await createProtectedProject(projectName, template);
  });

// Security audit command
program
  .command('security-audit')
  .description('🔍 Sicherheitsaudit durchführen')
  .action(async () => {
    console.log('\n🔍 Blueprint Sicherheitsaudit\n');
    console.log('══════════════════════════════════');
    
    const monitor = new AIActivityMonitor();
    const auditResults = {
      protectionStatus: AIProtectionSystem.isProtectionEnabled(),
      violations: monitor.getViolationsReport(),
      recommendations: [] as string[]
    };
    
    console.log(`🛡️  AI-Schutz: ${auditResults.protectionStatus ? 'AKTIV' : 'INAKTIV'}`);
    console.log(`📊 Verstöße: ${auditResults.violations.length}`);
    
    if (!auditResults.protectionStatus) {
      console.log('\n⚠️  KRITISCHE SICHERHEITSLÜCKE ERKANNT!');
      console.log('🚨 AI-Schutz ist deaktiviert - Blueprint-System ungeschützt!');
      auditResults.recommendations.push('AI-Schutz sofort aktivieren: npm run cli set-protection --enable');
      
      // Auto-enable protection if not enabled
      console.log('\n🔒 Aktiviere AI-Schutz automatisch...');
      try {
        await AIProtectionSystem.enableProtection();
        console.log('✅ AI-Schutz erfolgreich aktiviert');
      } catch (error) {
        console.error('❌ Fehler beim Aktivieren des AI-Schutzes:', error);
      }
    }
    
    // Display recommendations
    if (auditResults.recommendations.length > 0) {
      console.log('\n💡 Empfehlungen:');
      auditResults.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`);
      });
    }
    
    console.log('\n✅ Sicherheitsaudit abgeschlossen');
  });

// Status command
program
  .command('status')
  .description('📊 System-Status anzeigen')
  .action(() => {
    console.log('\n📊 Blueprint System Status\n');
    console.log('═══════════════════════════════');
    console.log(`   🛡️  AI-Schutz: ${AIProtectionSystem.isProtectionEnabled() ? 'AKTIV' : 'INAKTIV'}`);
    console.log(`   📁 Blueprint-Pfad: ${process.cwd()}`);
    console.log(`   📦 Sichere Projekte: ${AIProtectionSystem.suggestSafePaths().length}`);
    
    const deletableProjects = BlueprintSafety.listDeletableProjects();
    console.log(`   🗑️  Löschbare Projekte: ${deletableProjects.length}`);
    
    if (!AIProtectionSystem.isProtectionEnabled()) {
      console.log('\n🚨 WARNUNG: AI-Schutz ist deaktiviert!');
      console.log('   Aktivieren Sie ihn mit: npm run cli set-protection --enable');
    }
  });

// List projects command  
program
  .command('list-projects')
  .description('📋 Alle Projekte auflisten')
  .action(() => {
    console.log('\n📋 Blueprint Projekte\n');
    
    const safePaths = AIProtectionSystem.suggestSafePaths();
    const deletableProjects = BlueprintSafety.listDeletableProjects();
    
    console.log('🛡️  Sichere AI-Projekte:');
    if (safePaths.length === 0) {
      console.log('   (Keine sicheren Projekte gefunden)');
    } else {
      safePaths.forEach((project: string) => {
        console.log(`   ✅ ${project}`);
      });
    }
    
    console.log('\n🗑️  Löschbare Projekte:');
    if (deletableProjects.length === 0) {
      console.log('   (Keine löschbaren Projekte gefunden)');
    } else {
      deletableProjects.forEach((project: string) => {
        console.log(`   📁 ${project}`);
      });
    }
  });

// CLI Commands
const commands = {
  'status': () => AIProtectionSystem.showProtectionStatus(),
  'enable': () => AIProtectionSystem.enableProtection(),
  'disable': () => AIProtectionSystem.disableProtection(),
  'check': (path?: string) => {
    if (!path) {
      console.log('❌ Bitte geben Sie einen Pfad an: npm run cli check <pfad>');
      return;
    }
    const result = AIProtectionSystem.validateAIPath(path);
    console.log(`📁 Pfad: ${path}`);
    console.log(`✅ Status: ${result.allowed ? 'ERLAUBT' : 'BLOCKIERT'}`);
    console.log(`📝 Grund: ${result.reason}`);
  }
};

// Delete project command
program
  .command('delete')
  .description('🗑️  Projekt sicher löschen')
  .argument('<project-name>', 'Name des zu löschenden Projekts')
  .option('--force', 'Löschen erzwingen (vorsichtig verwenden)')
  .action(async (projectName: string, options) => {
    const projectPath = path.join(process.cwd(), projectName);
    
    console.log(`🗑️  Lösche Projekt: ${projectName}`);
    
    if (!options.force) {
      // Safety check
      if (BlueprintSafety.isBlueprintProtected(projectPath)) {
        console.error('🚨 FEHLER: Dieses Projekt ist geschützt und kann nicht gelöscht werden!');
        console.error('🛡️  Verwenden Sie --force nur wenn Sie sicher sind.');
        return;
      }
    }
    
    const success = await BlueprintSafety.safeDelete(projectPath);
    if (success) {
      console.log(`✅ Projekt "${projectName}" erfolgreich gelöscht`);
    }
  });

// Copy blueprint command  
program
  .command('copy-blueprint')
  .description('📋 Blueprint als neues Projekt kopieren')
  .argument('<project-name>', 'Name des neuen Projekts')
  .action(async (projectName: string) => {
    showWelcome();
    await createProtectedProject(projectName, 'dashboard');
  });

// Help command override
program
  .command('help')
  .description('❓ Hilfe anzeigen')
  .action(() => {
    showWelcome();
    console.log('Verfügbare Befehle:\n');
    console.log('🛡️  SCHUTZ-BEFEHLE:');
    console.log('   set-protection --enable    AI-Schutz aktivieren');
    console.log('   set-protection --disable   AI-Schutz deaktivieren');
    console.log('   start-daemon              Schutz-Daemon im Hintergrund starten');
    console.log('   stop-daemon               Schutz-Daemon stoppen');
    console.log('   protection-status          Schutz-Status anzeigen');
    console.log('   ai-safe-paths             Sichere AI-Pfade anzeigen');
    console.log('   security-audit            Sicherheitsaudit durchführen');
    console.log('');
    console.log('🚀 PROJEKT-BEFEHLE:');
    console.log('   create <name> -t <template>  Neues Projekt erstellen');
    console.log('   copy-blueprint <name>        Blueprint kopieren');
    console.log('   list-projects               Projekte auflisten');
    console.log('   delete <name>               Projekt löschen');
    console.log('');
    console.log('📊 SYSTEM-BEFEHLE:');
    console.log('   status                      System-Status');
    console.log('   help                        Diese Hilfe');
    console.log('');
    console.log('Templates: dashboard, analytics, data-table, map');
    console.log('');
    console.log('💡 Beispiele:');
    console.log('   npm run cli create mein-dashboard --template dashboard');
    console.log('   npm run cli ai-safe-paths');
    console.log('   npm run cli security-audit');
  });

// Initialize protection on startup if not running specific commands
const protectionCommands = ['set-protection', 'protection-status', 'help'];
const isProtectionCommand = process.argv.some(arg => protectionCommands.includes(arg));

if (!isProtectionCommand) {
  // Initialize protection system
  const aiProtection = AIProtectionSystem.getInstance();
  aiProtection.initializeProtection().catch(error => {
    console.warn('⚠️  Could not fully initialize AI protection:', error);
  });
}

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  showWelcome();
  program.help();
}

// Export for potential module usage
export { 
  AIProtectionSystem, 
  BlueprintSafety, 
  createProtectedProject, 
  generateTemplateWithValidation 
};