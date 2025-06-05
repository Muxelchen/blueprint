#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

// Define types for template metadata
interface TemplateMetadata {
  name: string;
  description: string;
  dependencies: string[];
  features: string[];
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

// CLI for rapid blueprint-based app generation
const program = new Command();

program
  .name('blueprint-cli')
  .description('Generate web apps instantly using Blueprint components')
  .version('1.0.0');

// List available templates
program
  .command('list')
  .description('List all available templates')
  .action(() => {
    console.log('\n🎨 Available Templates:\n');
    Object.entries(templateMetadata).forEach(([key, meta]) => {
      console.log(`📋 ${key.padEnd(12)} - ${meta.name}`);
      console.log(`   ${meta.description}`);
      console.log(`   Features: ${meta.features.join(', ')}`);
      console.log('');
    });
  });

program
  .command('create')
  .description('Create a new app from blueprint')
  .argument('<app-name>', 'name of the app')
  .option('-t, --template <type>', 'template type (dashboard, analytics, data-table, map)', 'dashboard')
  .option('-p, --preset <preset>', 'component preset (minimal, standard, full)', 'standard')
  .action(async (appName: string, options: { template: string; preset: string }) => {
    console.log(`🚀 Creating ${appName} with ${options.template} template...`);
    
    // Type-safe template validation
    if (!isValidTemplate(options.template)) {
      console.error(`❌ Template "${options.template}" not found. Use "blueprint list" to see available templates.`);
      process.exit(1);
    }
    
    await generateApp(appName, options.template as TemplateKey, options.preset);
  });

// Type guard function
function isValidTemplate(template: string): template is TemplateKey {
  return template in templateMetadata;
}

async function generateApp(name: string, template: TemplateKey, preset: string) {
  const targetDir = path.join(process.cwd(), name);
  const templateData = templateMetadata[template];
  
  console.log(`📁 Creating directory: ${targetDir}`);
  console.log(`🎯 Template: ${templateData.name}`);
  console.log(`⚙️  Preset: ${preset}`);
  
  try {
    // Create project structure
    await fs.promises.mkdir(targetDir, { recursive: true });
    await fs.promises.mkdir(path.join(targetDir, 'src'), { recursive: true });
    await fs.promises.mkdir(path.join(targetDir, 'src/components'), { recursive: true });
    await fs.promises.mkdir(path.join(targetDir, 'src/components/ui'), { recursive: true });
    await fs.promises.mkdir(path.join(targetDir, 'public'), { recursive: true });
    
    // Generate package.json with template-specific dependencies
    const packageJson = {
      name: name.toLowerCase().replace(/\s+/g, '-'),
      private: true,
      version: '0.1.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
        lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0'
      },
      dependencies: getTemplateDependencies(template, preset),
      devDependencies: getDevDependencies()
    };
    
    await fs.promises.writeFile(
      path.join(targetDir, 'package.json'), 
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create essential config files
    await createConfigFiles(targetDir);
    
    // Generate the main app component with the selected template
    await generateAppComponent(targetDir, template, name);
    
    // Create basic UI components
    await createUIComponents(targetDir, preset);
    
    // Create index.html
    await createIndexHtml(targetDir, name);
    
    // Create main.tsx
    await createMainTsx(targetDir);
    
    console.log(`\n✅ ${name} created successfully!`);
    console.log(`\n📋 Template: ${templateData.name}`);
    console.log(`📋 Features: ${templateData.features.join(', ')}`);
    console.log(`\n📁 Next steps:`);
    console.log(`   cd ${name}`);
    console.log(`   npm install`);
    console.log(`   npm run dev`);
    console.log(`\n🚀 Your ${template} app will be running at http://localhost:5173\n`);
    
  } catch (error) {
    console.error('❌ Error creating app:', error);
  }
}

function getTemplateDependencies(template: TemplateKey, preset: string) {
  const baseDeps = {
    'react': '^18.2.0',
    'react-dom': '^18.2.0',
    'framer-motion': '^10.16.4',
    'lucide-react': '^0.279.0'
  };

  const templateDeps = templateMetadata[template].dependencies.reduce((acc: Record<string, string>, dep: string) => {
    const versions: Record<string, string> = {
      'recharts': '^2.15.3',
      'zustand': '^4.4.1',
      'chart.js': '^4.4.9',
      'date-fns': '^4.1.0',
      'react-router-dom': '^6.15.0',
      'leaflet': '^1.9.4',
      'react-leaflet': '^4.2.1',
      '@types/leaflet': '^1.9.4'
    };
    acc[dep] = versions[dep] || 'latest';
    return acc;
  }, {});

  return { ...baseDeps, ...templateDeps };
}

function getDevDependencies() {
  return {
    '@types/react': '^18.2.15',
    '@types/react-dom': '^18.2.7',
    '@typescript-eslint/eslint-plugin': '^6.0.0',
    '@typescript-eslint/parser': '^6.0.0',
    '@vitejs/plugin-react': '^4.0.3',
    'autoprefixer': '^10.4.21',
    'eslint': '^8.45.0',
    'eslint-plugin-react-hooks': '^4.6.0',
    'eslint-plugin-react-refresh': '^0.4.3',
    'postcss': '^8.5.4',
    'tailwindcss': '^3.4.17',
    'typescript': '^5.0.2',
    'vite': '^4.4.5'
  };
}

async function createConfigFiles(targetDir: string) {
  // Vite config
  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})`;
  
  // TypeScript config
  const tsConfig = {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      baseUrl: '.',
      paths: {
        '@/*': ['./src/*']
      }
    },
    include: ['src'],
    references: [{ path: './tsconfig.node.json' }]
  };
  
  // Tailwind config
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

  // PostCSS config
  const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

  await fs.promises.writeFile(path.join(targetDir, 'vite.config.ts'), viteConfig);
  await fs.promises.writeFile(path.join(targetDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
  await fs.promises.writeFile(path.join(targetDir, 'tailwind.config.js'), tailwindConfig);
  await fs.promises.writeFile(path.join(targetDir, 'postcss.config.js'), postcssConfig);
}

async function generateAppComponent(targetDir: string, template: TemplateKey, appName: string) {
  const templateImports: Record<TemplateKey, string> = {
    dashboard: `import { BarChart, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';`,
    analytics: `import { BarChart3, PieChart, TrendingUp, Filter, Download, Calendar } from 'lucide-react';`,
    'data-table': `import { Table, Search, Plus, Edit, Trash2, Filter, Download, Eye } from 'lucide-react';`,
    map: `import { Map, MapPin, Navigation, Layers, Search, Filter, Download, Settings } from 'lucide-react';`
  };

  const appComponent = `import React from 'react';
import { motion } from 'framer-motion';
${templateImports[template]}
import { Button } from './components/ui/Button';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-gray-900">${appName}</h1>
            <p className="text-sm text-gray-600">Generated with Blueprint ${template} template</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">Settings</Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to ${appName}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your ${templateMetadata[template].name} is ready! 
              Start customizing your app with the powerful Blueprint components.
            </p>
            
            {/* Template Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              ${templateMetadata[template].features.map((feature: string, i: number) => `
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ${i * 0.1} }}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-2">${feature}</h3>
                <p className="text-sm text-gray-600">Ready to use ${feature.toLowerCase()} components</p>
              </motion.div>`).join('')}
            </div>

            <div className="mt-12">
              <Button size="lg">Explore Components</Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default App;`;

  await fs.promises.writeFile(path.join(targetDir, 'src/App.tsx'), appComponent);
}

async function createUIComponents(targetDir: string, preset: string) {
  // Button component
  const buttonComponent = `import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  disabled = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500', 
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={\`\${baseClasses} \${variants[variant]} \${sizes[size]} \${disabled ? 'opacity-50 cursor-not-allowed' : ''} \${className}\`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
};`;

  await fs.promises.writeFile(path.join(targetDir, 'src/components/ui/Button.tsx'), buttonComponent);
}

async function createIndexHtml(targetDir: string, appName: string) {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appName}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    </style>
  </head>
  <body style="font-family: 'Inter', sans-serif;">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

  await fs.promises.writeFile(path.join(targetDir, 'index.html'), indexHtml);
}

async function createMainTsx(targetDir: string) {
  const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`;

  const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;

  await fs.promises.writeFile(path.join(targetDir, 'src/main.tsx'), mainTsx);
  await fs.promises.writeFile(path.join(targetDir, 'src/index.css'), indexCss);
}

program.parse(process.argv);