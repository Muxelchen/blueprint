import React, { useState } from 'react';
import { DashboardTemplate, DataTableTemplate, AnalyticsTemplate, MapDashboardTemplate } from '../templates';
import { Button } from './common';

// Live Template Preview & Generator
export const TemplateShowcase: React.FC = () => {
  const [activeTemplate, setActiveTemplate] = useState<string>('dashboard');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const templates = [
    {
      id: 'dashboard',
      name: 'Dashboard Template',
      description: 'Complete business dashboard with KPI cards, charts, and data tables',
      features: ['Real-time updates', 'Dark mode support', 'Responsive design', 'Export capabilities'],
      useCase: 'Perfect for admin dashboards, business intelligence, and monitoring systems',
      component: DashboardTemplate
    },
    {
      id: 'datatable', 
      name: 'Data Table Template',
      description: 'Advanced data management with filtering, sorting, and pagination',
      features: ['Advanced filtering', 'Column sorting', 'Row selection', 'Export to CSV/PDF'],
      useCase: 'Ideal for data management, reporting systems, and content administration',
      component: DataTableTemplate
    },
    {
      id: 'analytics',
      name: 'Analytics Template', 
      description: 'Comprehensive analytics dashboard with multiple chart types',
      features: ['Interactive charts', 'Real-time data', 'Multiple visualizations', 'Drill-down capability'],
      useCase: 'Great for performance monitoring, metrics visualization, and data analysis',
      component: AnalyticsTemplate
    },
    {
      id: 'map',
      name: 'Map Dashboard Template',
      description: 'Interactive geographic data visualization with maps and location widgets',
      features: ['Interactive maps', 'Marker clustering', 'Heatmap overlays', 'Location analytics'],
      useCase: 'Perfect for logistics, location analytics, and geographic data visualization',
      component: MapDashboardTemplate
    }
  ];

  const currentTemplate = templates.find(t => t.id === activeTemplate);
  const ActiveComponent = currentTemplate?.component || DashboardTemplate;

  const handleGenerateCode = (templateId: string) => {
    const codeSnippet = `// Generated ${templates.find(t => t.id === templateId)?.name}
import { ${templateId.charAt(0).toUpperCase() + templateId.slice(1)}Template } from '@/templates';

export const My${templateId.charAt(0).toUpperCase() + templateId.slice(1)}App = () => {
  return <${templateId.charAt(0).toUpperCase() + templateId.slice(1)}Template />;
};`;
    
    navigator.clipboard.writeText(codeSnippet);
    alert('Code snippet copied to clipboard!');
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={() => setIsFullscreen(false)}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Exit Fullscreen
          </Button>
        </div>
        <ActiveComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Blueprint Template Showcase
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our pre-built templates designed for rapid application development. 
            Each template is production-ready and fully customizable.
          </p>
        </div>

        {/* Template Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setActiveTemplate(template.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTemplate === template.id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow'
              }`}
            >
              {template.name}
            </button>
          ))}
        </div>

        {/* Template Info */}
        {currentTemplate && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {currentTemplate.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {currentTemplate.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  {currentTemplate.useCase}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {currentTemplate.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t dark:border-gray-700">
              <Button
                onClick={() => setIsFullscreen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                View Fullscreen
              </Button>
              <Button
                onClick={() => handleGenerateCode(currentTemplate.id)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Copy Code
              </Button>
              <Button
                onClick={() => window.open(`#${currentTemplate.id}`, '_blank')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Open in New Tab
              </Button>
            </div>
          </div>
        )}

        {/* Template Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-100 dark:bg-gray-700 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                {currentTemplate?.name} Preview
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Live Template Rendering
            </div>
          </div>
          
          <div className="h-96 overflow-auto border-t dark:border-gray-700">
            <div className="transform scale-75 origin-top-left w-[133.33%] h-[133.33%]">
              <ActiveComponent />
            </div>
          </div>
        </div>

        {/* CLI Usage Instructions */}
        <div className="mt-8 bg-gray-900 rounded-xl p-6 text-green-400">
          <h3 className="text-xl font-bold mb-4 text-white">Generate with CLI</h3>
          <div className="space-y-2 font-mono text-sm">
            <div># Interactive mode</div>
            <div className="text-yellow-400">npm run blueprint</div>
            <div className="mt-4"># Direct template generation</div>
            <div className="text-yellow-400">npm run blueprint {currentTemplate?.id}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateShowcase;