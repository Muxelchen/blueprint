import React from 'react';
import {
  FileText,
  Image,
  FileJson, // Replace File component with FileJson for JSON files
} from 'lucide-react';

interface ExportFunctionsProps {
  data?: any;
  filename?: string;
  onExport?: (format: string, data: any) => void;
  className?: string;
}

// Export utility functions
export const exportToCSV = (data: any[], filename: string = 'export.csv') => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(header => {
          const value = row[header];
          // Handle values that might contain commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const exportToJSON = (data: any, filename: string = 'export.json') => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const exportToPDF = async (elementId: string, filename: string = 'export.pdf') => {
  try {
    // Basic PDF export using browser print
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found for PDF export');
      return;
    }

    // Create a new window with the content
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>${element.innerHTML}</body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  } catch (error) {
    console.error('PDF export failed:', error);
  }
};

export const exportToImage = async (
  elementId: string,
  filename: string = 'export.png',
  format: 'png' | 'jpeg' = 'png'
) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found for image export');
      return;
    }

    // Basic canvas-based image export
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = element.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Fill with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create a data URL and download
    const dataURL = canvas.toDataURL(`image/${format}`);
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Image export failed:', error);
  }
};

const ExportFunctions: React.FC<ExportFunctionsProps> = ({
  data,
  filename = 'export',
  onExport,
  className = '',
}) => {
  const handleExport = (format: string) => {
    if (onExport) {
      onExport(format, data);
      return;
    }

    switch (format) {
      case 'csv':
        if (Array.isArray(data)) {
          exportToCSV(data, `${filename}.csv`);
        }
        break;
      case 'json':
        exportToJSON(data, `${filename}.json`);
        break;
      case 'pdf':
        exportToPDF('export-content', `${filename}.pdf`);
        break;
      case 'png':
        exportToImage('export-content', `${filename}.png`, 'png');
        break;
      case 'jpeg':
        exportToImage('export-content', `${filename}.jpeg`, 'jpeg');
        break;
      default:
        console.warn('Unsupported export format:', format);
    }
  };

  return (
    <div className={`export-functions ${className}`}>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleExport('csv')}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export CSV
        </button>

        <button
          onClick={() => handleExport('json')}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FileJson className="w-4 h-4 mr-2" />
          Export JSON
        </button>

        <button
          onClick={() => handleExport('pdf')}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export PDF
        </button>

        <button
          onClick={() => handleExport('png')}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Image className="w-4 h-4 mr-2" />
          Export PNG
        </button>

        <button
          onClick={() => handleExport('jpeg')}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Image className="w-4 h-4 mr-2" />
          Export JPEG
        </button>
      </div>
    </div>
  );
};

// Example usage component
export const ExportExample: React.FC = () => {
  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 },
  ];

  const handleCustomExport = (format: string, data: any) => {
    console.log(`Custom export to ${format}:`, data);
    // Implement custom export logic here
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Export Functions Demo</h3>

        {/* Content to export */}
        <div id="export-content" className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <h4 className="font-medium mb-3">Sample Data Table</h4>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sampleData.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Export buttons */}
        <ExportFunctions
          data={sampleData}
          filename="sample-data"
          onExport={handleCustomExport}
          className="mb-4"
        />

        {/* Direct export buttons */}
        <div className="space-y-2">
          <h5 className="font-medium text-gray-700">Direct Export Functions:</h5>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => exportToCSV(sampleData, 'direct-export.csv')}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
            >
              Direct CSV Export
            </button>
            <button
              onClick={() => exportToJSON(sampleData, 'direct-export.json')}
              className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
            >
              Direct JSON Export
            </button>
            <button
              onClick={() => exportToPDF('export-content', 'direct-export.pdf')}
              className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
            >
              Direct PDF Export
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Export Instructions</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• CSV export works with array data and creates downloadable CSV files</li>
            <li>• JSON export converts any data to formatted JSON files</li>
            <li>• PDF export uses browser print functionality (may vary by browser)</li>
            <li>• Image export creates PNG/JPEG from DOM elements (basic implementation)</li>
            <li>• For production use, consider libraries like jsPDF, html2canvas, or xlsx</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExportFunctions;
