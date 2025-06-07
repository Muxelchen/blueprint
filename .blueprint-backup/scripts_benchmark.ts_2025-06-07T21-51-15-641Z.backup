#!/usr/bin/env node

import { performance } from 'perf_hooks';
import fs from 'fs/promises';
import path from 'path';

interface BenchmarkResult {
  name: string;
  duration: number;
  memoryUsage: number;
  timestamp: string;
}

class PerformanceBenchmark {
  private results: BenchmarkResult[] = [];

  async runBenchmarks() {
    console.log('🚀 Starting Blueprint Performance Benchmarks...\n');

    await this.benchmarkComponentRegistration();
    await this.benchmarkTemplateGeneration();
    await this.benchmarkBundleAnalysis();
    await this.generateReport();
  }

  private async benchmarkComponentRegistration() {
    console.log('📦 Benchmarking Component Registration...');
    const start = performance.now();
    const memStart = process.memoryUsage().heapUsed;

    try {
      // Simulate component registry loading
      const { componentRegistry } = await import('../src/utils/ComponentRegistry.js');
      const metrics = componentRegistry.getPerformanceMetrics();
      
      const end = performance.now();
      const memEnd = process.memoryUsage().heapUsed;
      
      this.results.push({
        name: 'Component Registration',
        duration: end - start,
        memoryUsage: (memEnd - memStart) / 1024 / 1024,
        timestamp: new Date().toISOString()
      });

      console.log(`✅ Registered ${metrics.totalComponents} components in ${(end - start).toFixed(2)}ms`);
    } catch (error) {
      console.warn('⚠️ Component registration benchmark failed:', error);
    }
  }

  private async benchmarkTemplateGeneration() {
    console.log('🎨 Benchmarking Template Generation...');
    const start = performance.now();
    const memStart = process.memoryUsage().heapUsed;

    try {
      const { TemplateGenerator } = await import('../src/utils/TemplateGenerator.js');
      const generator = TemplateGenerator.getInstance();
      
      // Generate multiple templates
      const templates = generator.getAvailableTemplates();
      for (const template of templates.slice(0, 5)) {
        generator.generateTemplate(template);
      }
      
      const end = performance.now();
      const memEnd = process.memoryUsage().heapUsed;
      
      this.results.push({
        name: 'Template Generation',
        duration: end - start,
        memoryUsage: (memEnd - memStart) / 1024 / 1024,
        timestamp: new Date().toISOString()
      });

      console.log(`✅ Generated ${templates.length} templates in ${(end - start).toFixed(2)}ms`);
    } catch (error) {
      console.warn('⚠️ Template generation benchmark failed:', error);
    }
  }

  private async benchmarkBundleAnalysis() {
    console.log('📊 Analyzing Bundle Size...');
    const start = performance.now();

    try {
      const distPath = path.join(process.cwd(), 'dist');
      
      try {
        const files = await fs.readdir(distPath, { recursive: true });
        let totalSize = 0;
        
        for (const file of files) {
          if (typeof file === 'string') {
            const filePath = path.join(distPath, file);
            try {
              const stats = await fs.stat(filePath);
              if (stats.isFile()) {
                totalSize += stats.size;
              }
            } catch {
              // Skip files that can't be accessed
            }
          }
        }
        
        const end = performance.now();
        
        this.results.push({
          name: 'Bundle Analysis',
          duration: end - start,
          memoryUsage: totalSize / 1024 / 1024,
          timestamp: new Date().toISOString()
        });

        console.log(`✅ Bundle size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
      } catch {
        console.log('⚠️ No dist folder found. Run `npm run build` first for bundle analysis.');
      }
    } catch (error) {
      console.warn('⚠️ Bundle analysis failed:', error);
    }
  }

  private async generateReport() {
    console.log('\n📈 Performance Report:');
    console.log('─'.repeat(60));
    
    this.results.forEach(result => {
      console.log(`${result.name.padEnd(25)} ${result.duration.toFixed(2)}ms`.padEnd(15) + 
                  `${result.memoryUsage.toFixed(2)}MB`);
    });

    console.log('─'.repeat(60));
    
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);
    const totalMemory = this.results.reduce((sum, r) => sum + r.memoryUsage, 0);
    
    console.log(`Total Time: ${totalTime.toFixed(2)}ms`);
    console.log(`Total Memory: ${totalMemory.toFixed(2)}MB\n`);

    // Save detailed report
    const reportPath = path.join(process.cwd(), 'performance-report.json');
    await fs.writeFile(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        totalTime,
        totalMemory,
        benchmarkCount: this.results.length
      },
      details: this.results
    }, null, 2));

    console.log(`📄 Detailed report saved to: ${reportPath}`);
  }
}

// Run benchmarks
const benchmark = new PerformanceBenchmark();
benchmark.runBenchmarks().catch(console.error);