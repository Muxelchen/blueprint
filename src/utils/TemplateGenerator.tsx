import React from 'react';
import { motion } from 'framer-motion';
import { TEMPLATE_REGISTRY, templateMetadata } from '../templates';

// Template Generator - Dynamic template creation utility
export class TemplateGenerator {
  private static instance: TemplateGenerator;
  
  public static getInstance(): TemplateGenerator {
    if (!TemplateGenerator.instance) {
      TemplateGenerator.instance = new TemplateGenerator();
    }
    return TemplateGenerator.instance;
  }

  // Generate template code dynamically
  generateTemplate(templateKey: string, customizations?: TemplateCustomizations): string {
    const template = TEMPLATE_REGISTRY[templateKey as keyof typeof TEMPLATE_REGISTRY];
    const metadata = templateMetadata[templateKey as keyof typeof templateMetadata];
    
    if (!template || !metadata) {
      throw new Error(`Template "${templateKey}" not found`);
    }

    return this.buildTemplateCode(templateKey, template, metadata, customizations);
  }

  // Build template with customizations
  private buildTemplateCode(
    templateKey: string, 
    template: any, 
    metadata: any,
    customizations?: TemplateCustomizations
  ): string {
    const imports = this.generateImports(metadata.dependencies);
    const componentName = `${this.capitalize(templateKey)}Template`;
    const features = customizations?.features || metadata.features;
    
    return `
import React from 'react';
import { motion } from 'framer-motion';
${imports}

// Auto-generated ${template.name}
// Features: ${features.join(', ')}
export const ${componentName}: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          ${template.name}
        </h1>
        <p className="text-gray-600 mb-8">
          ${template.description}
        </p>
        
        ${this.generateFeatureComponents(features)}
      </div>
    </div>
  );
};

export default ${componentName};
    `.trim();
  }

  // Generate imports based on dependencies
  private generateImports(dependencies: string[]): string {
    const importMap: Record<string, string> = {
      'recharts': "import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';",
      'lucide-react': "import { BarChart3, Users, TrendingUp, Settings } from 'lucide-react';",
      'react-router-dom': "import { useNavigate, useLocation } from 'react-router-dom';",
      'leaflet': "import L from 'leaflet';",
      'chart.js': "import { Chart as ChartJS } from 'chart.js';"
    };

    return dependencies
      .map(dep => importMap[dep] || `// Import ${dep}`)
      .join('\n');
  }

  // Generate feature-based components
  private generateFeatureComponents(features: string[]): string {
    const featureMap: Record<string, string> = {
      'KPI Cards': `
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <KPICard title="Total Users" value="1,234" change="+12%" />
          <KPICard title="Revenue" value="$45,678" change="+8%" />
          <KPICard title="Conversion" value="3.4%" change="+15%" />
          <KPICard title="Growth" value="23%" change="+5%" />
        </div>`,
      'Charts': `
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer title="Analytics Overview">
            <div className="h-64 bg-blue-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Chart Component Here</p>
            </div>
          </ChartContainer>
        </div>`,
      'Data Tables': `
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Data Table</h3>
          </div>
          <div className="p-4">
            <p className="text-gray-600">Table content will be rendered here</p>
          </div>
        </div>`,
      'Search & Filter': `
        <div className="mb-6 flex items-center space-x-4">
          <input 
            type="text" 
            placeholder="Search..." 
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Filter
          </button>
        </div>`
    };

    return features
      .map(feature => featureMap[feature] || `<!-- ${feature} feature -->`)
      .join('\n        ');
  }

  // Utility methods
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Get available templates
  getAvailableTemplates(): string[] {
    return Object.keys(TEMPLATE_REGISTRY);
  }

  // Get template info
  getTemplateInfo(templateKey: string) {
    return TEMPLATE_REGISTRY[templateKey as keyof typeof TEMPLATE_REGISTRY];
  }

  // Quick template generation
  static generateQuickTemplate = (type: string): string => {
    const metadata = templateMetadata[type as keyof typeof templateMetadata];
    if (!metadata) {
      return `// Template type "${type}" not found`;
    }

    return `
import React from 'react';

export const ${type.charAt(0).toUpperCase() + type.slice(1)}Template: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">${type} Template</h1>
      <p>Generated template for ${type}</p>
    </div>
  );
};
    `.trim();
  };

  // Render template showcase
  renderTemplateShowcase(): React.ReactElement {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(TEMPLATE_REGISTRY).map(([key, template]) => {
          const metadata = templateMetadata[key as keyof typeof templateMetadata];
          return (
            <motion.div
              key={key}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
              <p className="text-gray-600 mb-4">{template.description}</p>
              
              {metadata && (
                <>
                  <div className="mb-3">
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Features:</h4>
                    {(metadata.features || []).map((feature: string) => (
                      <span 
                        key={feature}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Dependencies:</h4>
                    {(metadata.dependencies || []).map((dep: string) => (
                      <span 
                        key={dep}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1"
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                </>
              )}
              
              <button 
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                onClick={() => this.generateTemplate(key)}
              >
                Generate {template.name}
              </button>
            </motion.div>
          );
        })}
      </div>
    );
  }
}

// Template customization interface
export interface TemplateCustomizations {
  features?: string[];
  theme?: 'light' | 'dark' | 'auto';
  colorScheme?: string;
  layout?: 'sidebar' | 'topbar' | 'grid';
  components?: string[];
}

// Quick template generation functions
export const generateQuickTemplate = (type: string, name: string = type): string => {
  const generator = TemplateGenerator.getInstance();
  return generator.generateTemplate(type, { features: ['KPI Cards', 'Charts'] });
};

export const generateCustomTemplate = (
  type: string, 
  customizations: TemplateCustomizations
): string => {
  const generator = TemplateGenerator.getInstance();
  return generator.generateTemplate(type, customizations);
};

// Template preview generator
export const generateTemplatePreview = (templateKey: string): React.FC => {
  const template = TEMPLATE_REGISTRY[templateKey as keyof typeof TEMPLATE_REGISTRY];
  const metadata = templateMetadata[templateKey as keyof typeof templateMetadata];
  
  return () => (
    <div className="p-6 bg-white rounded-lg border border-gray-200 max-w-2xl">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
      <p className="text-gray-600 mb-4">{template.description}</p>
      
      {metadata && (
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-700">Features:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {(metadata.features || []).map((feature: string) => (
                <span 
                  key={feature}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-700">Dependencies:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {(metadata.dependencies || []).map((dep: string) => (
                <span 
                  key={dep}
                  className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                >
                  {dep}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateGenerator;