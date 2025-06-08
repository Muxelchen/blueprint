// Development Error Prevention Utilities
// Run these checks before starting development to catch common issues

import * as fs from 'fs';
import * as path from 'path';

interface ErrorCheck {
  name: string;
  description: string;
  check: () => Promise<string[]>;
  fix?: () => Promise<void>;
}

export class DevErrorPrevention {
  private static checks: ErrorCheck[] = [
    {
      name: 'Missing Component Files',
      description: 'Check for components referenced in index files but not implemented',
      check: async () => {
        const errors: string[] = [];
        const componentDirs = [
          'src/components/common/buttons',
          'src/components/common/inputs',
          'src/components/common/display',
          'src/components/common/feedback',
          'src/components/common/overlays',
          'src/components/widgets',
          'src/components/layout',
          'src/components/navigation',
        ];

        for (const dir of componentDirs) {
          try {
            const indexPath = path.join(process.cwd(), dir, 'index.ts');
            if (fs.existsSync(indexPath)) {
              const content = fs.readFileSync(indexPath, 'utf-8');
              // Look for both named and default exports
              const defaultExports =
                content.match(
                  /export\s*{\s*default\s+as\s+\w+\s*}\s*from\s*['"`]\.\/([^'"`]+)['"`]/g
                ) || [];
              const namedExports =
                content.match(/export\s*\*\s*from\s*['"`]\.\/([^'"`]+)['"`]/g) || [];
              const directExports = content.match(/export.*from.*['"`]\.\/([^'"`]+)['"`]/g) || [];

              const allExports = [...defaultExports, ...namedExports, ...directExports];

              for (const exportLine of allExports) {
                const match = exportLine.match(/['"`]\.\/([^'"`]+)['"`]/);
                if (match) {
                  const componentName = match[1];
                  // Skip checking for subdirectories (like containers, nav-components)
                  if (componentName.includes('/')) continue;

                  const componentFile = path.join(process.cwd(), dir, `${componentName}.tsx`);
                  if (!fs.existsSync(componentFile)) {
                    errors.push(`Missing component: ${componentFile}`);
                  }
                }
              }
            }
          } catch (error) {
            // Directory doesn't exist, skip
          }
        }
        return errors;
      },
    },
    {
      name: 'Package Dependencies',
      description: 'Check for missing npm packages in package.json',
      check: async () => {
        const errors: string[] = [];
        const requiredPackages = [
          'react',
          'react-dom',
          'typescript',
          '@types/react',
          '@types/react-dom',
          'vite',
          '@vitejs/plugin-react',
          'tailwindcss',
          'postcss',
          'autoprefixer',
          'framer-motion',
          'lucide-react',
          'recharts',
          'zustand',
        ];

        try {
          const packageJsonPath = path.join(process.cwd(), 'package.json');
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
          const allDeps = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
          };

          for (const pkg of requiredPackages) {
            if (!allDeps[pkg]) {
              errors.push(`Missing package: ${pkg}`);
            }
          }
        } catch (error) {
          errors.push('Cannot read package.json');
        }
        return errors;
      },
    },
    {
      name: 'TypeScript Configuration',
      description: 'Validate TypeScript configuration for development',
      check: async () => {
        const errors: string[] = [];
        try {
          const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
          if (!fs.existsSync(tsconfigPath)) {
            errors.push('tsconfig.json not found');
            return errors;
          }

          const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

          // Check for recommended settings
          if (!tsconfig.compilerOptions) {
            errors.push('Missing compilerOptions in tsconfig.json');
            return errors;
          }

          const recommended = {
            skipLibCheck: true,
            jsx: 'react-jsx',
          };

          for (const [key, value] of Object.entries(recommended)) {
            if (tsconfig.compilerOptions[key] !== value) {
              errors.push(
                `TypeScript config: ${key} should be ${value}, got ${tsconfig.compilerOptions[key]}`
              );
            }
          }
        } catch (error) {
          errors.push(
            `Cannot read tsconfig.json: ${error instanceof Error ? error.message : String(error)}`
          );
        }
        return errors;
      },
    },
  ];

  static async runAllChecks(): Promise<void> {
    console.log('🔍 Running development error prevention checks...\n');

    let totalErrors = 0;

    for (const check of this.checks) {
      console.log(`⚡ ${check.name}: ${check.description}`);
      try {
        const errors = await check.check();
        if (errors.length === 0) {
          console.log('  ✅ No issues found\n');
        } else {
          console.log(`  ❌ Found ${errors.length} issue(s):`);
          errors.forEach(error => console.log(`    - ${error}`));
          console.log('');
          totalErrors += errors.length;
        }
      } catch (error) {
        console.log(`  ⚠️  Check failed: ${error}\n`);
      }
    }

    if (totalErrors === 0) {
      console.log('🎉 All checks passed! You should have fewer errors when coding.');
    } else {
      console.log(
        `⚠️  Found ${totalErrors} potential issues. Consider fixing them before development.`
      );
    }
  }

  // Create missing component stubs
  static async createComponentStubs(): Promise<void> {
    const componentTemplate = (name: string, category: string) => `import React from 'react';

export interface ${name}Props {
  children?: React.ReactNode;
  className?: string;
}

const ${name}: React.FC<${name}Props> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={\`${name.toLowerCase()}-component \${className}\`}>
      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <h3 className="text-lg font-medium text-gray-900">${name}</h3>
        <p className="text-gray-600">Component implementation needed</p>
        {children}
      </div>
    </div>
  );
};

export default ${name};
`;

    // Common components that are often missing
    const commonComponents = [
      { name: 'Button', path: 'src/components/common/buttons', category: 'button' },
      { name: 'InputField', path: 'src/components/common/inputs', category: 'input' },
      { name: 'Modal', path: 'src/components/common/overlays', category: 'overlay' },
      { name: 'LoadingSpinner', path: 'src/components/common/feedback', category: 'feedback' },
    ];

    for (const component of commonComponents) {
      const filePath = path.join(process.cwd(), component.path, `${component.name}.tsx`);
      const dirPath = path.dirname(filePath);

      // Create directory if it doesn't exist
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Create component if it doesn't exist
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, componentTemplate(component.name, component.category));
        console.log(`✅ Created stub: ${component.name}`);
      }
    }
  }
}

export default DevErrorPrevention;
