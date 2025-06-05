import * as fs from 'fs';
import * as path from 'path';

// Development utilities for rapid prototyping
export class DevUtils {
  
  // Generate mock data for components
  static generateMockData(type: 'dashboard' | 'table' | 'chart' | 'analytics', count: number = 10) {
    const generators = {
      dashboard: () => ({
        kpis: [
          { id: 1, title: 'Total Revenue', value: '$1,234,567', change: '+12.5%', trend: 'up' },
          { id: 2, title: 'Active Users', value: '45,231', change: '+8.2%', trend: 'up' },
          { id: 3, title: 'Conversion Rate', value: '3.45%', change: '-0.5%', trend: 'down' },
          { id: 4, title: 'Avg Order Value', value: '$89.50', change: '+15.3%', trend: 'up' }
        ],
        recentActivity: Array.from({ length: count }, (_, i) => ({
          id: i + 1,
          user: `User ${i + 1}`,
          action: ['logged in', 'made purchase', 'updated profile', 'viewed product'][Math.floor(Math.random() * 4)],
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          value: Math.floor(Math.random() * 1000)
        }))
      }),
      table: () => Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
        email: `user${i + 1}@example.com`,
        role: ['Admin', 'User', 'Manager'][Math.floor(Math.random() * 3)],
        lastActive: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        value: Math.floor(Math.random() * 10000)
      })),
      chart: () => ({
        lineData: Array.from({ length: 12 }, (_, i) => ({
          month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
          value: Math.floor(Math.random() * 1000) + 500,
          target: Math.floor(Math.random() * 1000) + 600
        })),
        pieData: [
          { name: 'Desktop', value: 45, color: '#3B82F6' },
          { name: 'Mobile', value: 35, color: '#10B981' },
          { name: 'Tablet', value: 20, color: '#F59E0B' }
        ],
        barData: Array.from({ length: 7 }, (_, i) => ({
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          visitors: Math.floor(Math.random() * 500) + 100,
          conversions: Math.floor(Math.random() * 50) + 10
        }))
      }),
      analytics: () => ({
        metrics: {
          totalVisitors: Math.floor(Math.random() * 100000) + 50000,
          pageViews: Math.floor(Math.random() * 500000) + 200000,
          bounceRate: (Math.random() * 0.3 + 0.2).toFixed(2),
          avgSessionDuration: `${Math.floor(Math.random() * 5) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        },
        topPages: Array.from({ length: 5 }, (_, i) => ({
          page: [`/home`, `/products`, `/about`, `/contact`, `/blog`][i],
          views: Math.floor(Math.random() * 10000) + 1000,
          uniqueViews: Math.floor(Math.random() * 8000) + 800
        })),
        trafficSources: [
          { source: 'Organic Search', percentage: 45, visitors: 23450 },
          { source: 'Direct', percentage: 25, visitors: 13250 },
          { source: 'Social Media', percentage: 15, visitors: 7850 },
          { source: 'Referrals', percentage: 10, visitors: 5300 },
          { source: 'Email', percentage: 5, visitors: 2650 }
        ]
      })
    };

    return generators[type]();
  }

  // Generate a complete API mock
  static generateApiMock(endpoints: string[]) {
    const mockApi = {
      baseURL: 'http://localhost:3001/api',
      endpoints: {} as Record<string, any>
    };

    endpoints.forEach(endpoint => {
      const [method, path] = endpoint.split(' ');
      const resourceName = path.split('/')[1];
      
      mockApi.endpoints[endpoint] = {
        method: method.toUpperCase(),
        path,
        response: this.generateMockResponse(resourceName),
        delay: Math.floor(Math.random() * 1000) + 200
      };
    });

    return mockApi;
  }

  private static generateMockResponse(resource: string) {
    const responses: Record<string, () => any> = {
      users: () => Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: ['admin', 'user', 'manager'][Math.floor(Math.random() * 3)],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
        lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString()
      })),
      products: () => Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        price: Math.floor(Math.random() * 500) + 20,
        category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
        inStock: Math.floor(Math.random() * 100),
        image: `https://picsum.photos/200/200?random=${i}`
      })),
      orders: () => Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        userId: Math.floor(Math.random() * 20) + 1,
        total: Math.floor(Math.random() * 1000) + 50,
        status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString()
      }))
    };

    return responses[resource] ? responses[resource]() : { message: 'Mock data not available' };
  }

  // Performance optimization utilities
  static generateLazyImports(components: string[]): string {
    return components.map(comp => 
      `const ${comp} = lazy(() => import('./components/${comp}'));`
    ).join('\n');
  }

  static generateSuspenseBoundary(components: string[]): string {
    return `
import React, { Suspense } from 'react';
import { LoadingSpinner } from './components/LoadingSpinner';

${this.generateLazyImports(components)}

export const AppWithSuspense = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Router>
      <Routes>
        ${components.map(comp => 
          `<Route path="/${comp.toLowerCase()}" element={<${comp} />} />`
        ).join('\n        ')}
      </Routes>
    </Router>
  </Suspense>
);`;
  }

  // State management utilities
  static generateZustandStore(storeName: string, fields: Array<{name: string, type: string, default: any}>) {
    const storeFields = fields.map(field => 
      `  ${field.name}: ${JSON.stringify(field.default)},`
    ).join('\n');

    const setters = fields.map(field => 
      `  set${field.name.charAt(0).toUpperCase() + field.name.slice(1)}: (${field.name}: ${field.type}) => set({ ${field.name} }),`
    ).join('\n');

    return `import { create } from 'zustand';

interface ${storeName}State {
${fields.map(field => `  ${field.name}: ${field.type};`).join('\n')}
${fields.map(field => `  set${field.name.charAt(0).toUpperCase() + field.name.slice(1)}: (${field.name}: ${field.type}) => void;`).join('\n')}
}

export const use${storeName} = create<${storeName}State>((set) => ({
${storeFields}
${setters}
}));`;
  }

  // Testing utilities
  static generateTestHelpers(): string {
    return `import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Custom render function with providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Mock data generators for tests
export const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'user'
};

export const mockApiResponse = (data: any, delay = 0) => 
  new Promise(resolve => setTimeout(() => resolve(data), delay));

// re-export everything
export * from '@testing-library/react';
export { customRender as render };`;
  }

  // Documentation generator
  static generateComponentDocs(componentName: string, props: Array<{name: string, type: string, description: string, required: boolean}>) {
    return `# ${componentName}

## Description
${componentName} component for rapid development.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
${props.map(prop => 
  `| ${prop.name} | \`${prop.type}\` | ${prop.required ? '✅' : '❌'} | ${prop.description} |`
).join('\n')}

## Usage

\`\`\`tsx
import { ${componentName} } from './components/${componentName}';

export const Example = () => (
  <${componentName}
    ${props.filter(p => p.required).map(p => `${p.name}={/* ${p.type} */}`).join('\n    ')}
  />
);
\`\`\`

## Examples

### Basic Usage
\`\`\`tsx
<${componentName} />
\`\`\`

### Advanced Usage
\`\`\`tsx
<${componentName}
  ${props.map(p => `${p.name}={/* example ${p.type} value */}`).join('\n  ')}
/>
\`\`\`
`;
  }
}

export default DevUtils;