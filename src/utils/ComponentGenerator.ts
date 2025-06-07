import * as fs from 'fs';
import * as path from 'path';

// Dynamic component generator for rapid development
export class ComponentGenerator {
  private componentsPath: string;

  constructor(projectPath: string = './src/components') {
    this.componentsPath = projectPath;
  }

  async generateComponent(
    name: string,
    type: 'widget' | 'form' | 'layout' | 'data-viz' | 'input',
    options: {
      withState?: boolean;
      withProps?: boolean;
      withAnimation?: boolean;
      withTests?: boolean;
      responsive?: boolean;
    } = {}
  ) {
    const {
      withState = false,
      withProps = true,
      withAnimation = false,
      withTests = false,
      responsive = true,
    } = options;

    const componentCode = this.generateComponentCode(name, type, {
      withState,
      withProps,
      withAnimation,
      responsive,
    });

    const componentPath = path.join(this.componentsPath, `${name}.tsx`);

    try {
      await fs.promises.writeFile(componentPath, componentCode);

      if (withTests) {
        await this.generateTestFile(name);
      }

      console.log(`✅ Generated ${name} component at ${componentPath}`);
      return componentPath;
    } catch (error) {
      console.error(`❌ Error generating component: ${error}`);
      throw error;
    }
  }

  private generateComponentCode(
    name: string,
    type: string,
    options: {
      withState: boolean;
      withProps: boolean;
      withAnimation: boolean;
      responsive: boolean;
    }
  ): string {
    const { withState, withProps, withAnimation, responsive } = options;

    const imports = [
      'import React' + (withState ? ', { useState, useEffect }' : '') + " from 'react';",
      withAnimation ? "import { motion } from 'framer-motion';" : '',
      "import { LucideIcon } from 'lucide-react';",
    ]
      .filter(Boolean)
      .join('\n');

    const propsInterface = withProps
      ? `
interface ${name}Props {
  className?: string;
  ${this.getPropsForType(type)}
}`
      : '';

    const stateLogic = withState
      ? `
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Component initialization logic
  }, []);`
      : '';

    const componentWrapper = withAnimation ? 'motion.div' : 'div';
    const animationProps = withAnimation
      ? `
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}`
      : '';

    const responsiveClasses = responsive ? this.getResponsiveClasses(type) : '';

    return `${imports}

${propsInterface}

export const ${name}: React.FC${withProps ? `<${name}Props>` : ''} = (${withProps ? 'props' : ''}) => {${withState ? stateLogic : ''}

  return (
    <${componentWrapper}
      className={\`${responsiveClasses} \${${withProps ? 'props.className || ' : ''}''}\`}${animationProps}
    >
      ${this.getComponentContent(name, type)}
    </${componentWrapper}>
  );
};

export default ${name};`;
  }

  private getPropsForType(type: string): string {
    const typeProps: Record<string, string> = {
      widget: `
  title?: string;
  data?: any[];
  loading?: boolean;
  onRefresh?: () => void;`,
      form: `
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  initialValues?: Record<string, any>;
  disabled?: boolean;`,
      layout: `
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;`,
      'data-viz': `
  data: any[];
  title?: string;
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';`,
      input: `
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;`,
    };

    return (
      typeProps[type] ||
      `
  children?: React.ReactNode;`
    );
  }

  private getResponsiveClasses(type: string): string {
    const typeClasses: Record<string, string> = {
      widget: 'w-full bg-white rounded-lg border border-gray-200 p-4 md:p-6',
      form: 'w-full max-w-md mx-auto bg-white rounded-lg shadow-sm p-6',
      layout: 'min-h-screen bg-gray-50',
      'data-viz': 'w-full bg-white rounded-lg border border-gray-200 p-4',
      input:
        'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    };

    return typeClasses[type] || 'w-full';
  }

  private getComponentContent(name: string, type: string): string {
    const typeContent: Record<string, string> = {
      widget: `
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {${name.includes('Props') ? 'props.title || ' : ''}${name}}
        </h3>
      </div>
      <div className="space-y-4">
        {/* Widget content goes here */}
        <p className="text-gray-600">Widget content placeholder</p>
      </div>`,
      form: `
      <form onSubmit={(e) => {
        e.preventDefault();
        // Handle form submission
      }}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Label
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter value..."
            />
          </div>
        </div>
        <div className="flex space-x-3 mt-6">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>`,
      layout: `
      <div className="flex flex-col lg:flex-row min-h-screen">
        <aside className="w-full lg:w-64 bg-white border-r border-gray-200">
          {/* Sidebar content */}
        </aside>
        <main className="flex-1 p-6">
          {/* Main content */}
        </main>
      </div>`,
      'data-viz': `
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Data Visualization</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Chart placeholder - integrate with your preferred charting library</p>
        </div>
      </div>`,
      input: `
      <input
        type="text"
        placeholder="Enter value..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />`,
    };

    return (
      typeContent[type] ||
      `
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">${name}</h2>
        <p className="text-gray-600">Component content goes here</p>
      </div>`
    );
  }

  private async generateTestFile(name: string): Promise<void> {
    const testCode = `import React from 'react';
import { render, screen } from '@testing-library/react';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('renders without crashing', () => {
    render(<${name} />);
  });

  it('displays correct content', () => {
    render(<${name} />);
    // Add your test assertions here
  });
});`;

    const testPath = path.join(this.componentsPath, `${name}.test.tsx`);
    await fs.promises.writeFile(testPath, testCode);
    console.log(`✅ Generated test file at ${testPath}`);
  }

  async generateFromTemplate(templateName: string, customizations: Record<string, any> = {}) {
    // Generate components based on predefined templates
    const templates: Record<string, Array<{ name: string; type: string; options: any }>> = {
      'dashboard-kit': [
        { name: 'KPICard', type: 'widget', options: { withState: true, withAnimation: true } },
        { name: 'DataTable', type: 'widget', options: { withProps: true, responsive: true } },
        { name: 'ChartWidget', type: 'data-viz', options: { withAnimation: true } },
      ],
      'form-kit': [
        { name: 'FormInput', type: 'input', options: { withProps: true } },
        { name: 'FormSelect', type: 'input', options: { withProps: true } },
        { name: 'FormWrapper', type: 'form', options: { withState: true } },
      ],
      'layout-kit': [
        { name: 'AppLayout', type: 'layout', options: { withProps: true, responsive: true } },
        { name: 'Sidebar', type: 'layout', options: { withAnimation: true } },
        { name: 'Header', type: 'layout', options: { responsive: true } },
      ],
    };

    const template = templates[templateName];
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    console.log(`🚀 Generating ${templateName} components...`);

    for (const component of template) {
      await this.generateComponent(component.name, component.type as any, {
        ...component.options,
        ...customizations,
      });
    }

    console.log(`✅ ${templateName} generated successfully!`);
  }
}

// CLI integration for component generation
export async function generateComponentCLI(name: string, type: string, options: any = {}) {
  const generator = new ComponentGenerator();
  await generator.generateComponent(name, type as any, options);
}

export async function generateTemplateCLI(templateName: string, customizations: any = {}) {
  const generator = new ComponentGenerator();
  await generator.generateFromTemplate(templateName, customizations);
}
