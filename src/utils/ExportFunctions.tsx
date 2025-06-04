import React, { useState } from 'react';
import { FileText, Table, Image } from 'lucide-react';
import Button from '../components/common/buttons/Button';

// Extend Window interface for html2canvas
declare global {
  interface Window {
    html2canvas?: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
  }
}

export interface ExportData {
  headers?: string[];
  rows?: any[][];
  data?: any[];
  title?: string;
  filename?: string;
}

export interface ExportFunctionsProps {
  data: ExportData;
  className?: string;
  elementId?: string; // For PDF export of specific element
}

const ExportFunctions: React.FC<ExportFunctionsProps> = ({
  data,
  className = '',
  elementId
}) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  // Convert data to CSV format
  const exportToCSV = async () => {
    setIsExporting('csv');
    
    try {
      let csvContent = '';
      
      if (data.headers && data.rows) {
        // Table format
        csvContent = data.headers.join(',') + '\n';
        csvContent += data.rows.map(row => 
          row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ).join('\n');
      } else if (data.data) {
        // Object array format
        const headers = Object.keys(data.data[0] || {});
        csvContent = headers.join(',') + '\n';
        csvContent += data.data.map(item => 
          headers.map(header => `"${String(item[header] || '').replace(/"/g, '""')}"`).join(',')
        ).join('\n');
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${data.filename || data.title || 'export'}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('CSV export failed:', error);
      alert('Failed to export CSV file');
    } finally {
      setIsExporting(null);
    }
  };

  // Export as JSON
  const exportToJSON = async () => {
    setIsExporting('json');
    
    try {
      const jsonData = {
        title: data.title,
        exportDate: new Date().toISOString(),
        data: data.data || (data.headers && data.rows ? 
          data.rows.map(row => Object.fromEntries(data.headers!.map((header, i) => [header, row[i]]))) : 
          [])
      };

      const jsonString = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${data.filename || data.title || 'export'}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('JSON export failed:', error);
      alert('Failed to export JSON file');
    } finally {
      setIsExporting(null);
    }
  };

  // Export as PDF (using browser print to PDF)
  const exportToPDF = async () => {
    setIsExporting('pdf');
    
    try {
      if (elementId) {
        // Export specific element
        const element = document.getElementById(elementId);
        if (element) {
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            const styles = Array.from(document.styleSheets)
              .map(styleSheet => {
                try {
                  return Array.from(styleSheet.cssRules)
                    .map(rule => rule.cssText)
                    .join('\n');
                } catch (e) {
                  return '';
                }
              })
              .join('\n');

            printWindow.document.write(`
              <!DOCTYPE html>
              <html>
                <head>
                  <title>${data.title || 'Export'}</title>
                  <style>
                    ${styles}
                    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                    @media print {
                      body { margin: 0; padding: 0; }
                      .no-print { display: none !important; }
                    }
                    .print-header {
                      text-align: center;
                      margin-bottom: 20px;
                      border-bottom: 2px solid #333;
                      padding-bottom: 10px;
                    }
                    .print-footer {
                      margin-top: 20px;
                      text-align: center;
                      font-size: 12px;
                      color: #666;
                    }
                  </style>
                </head>
                <body>
                  <div class="print-header">
                    <h1>${data.title || 'Export'}</h1>
                    <p>Generated on ${new Date().toLocaleString()}</p>
                  </div>
                  ${element.outerHTML}
                  <div class="print-footer">
                    <p>Exported from Dashboard</p>
                  </div>
                </body>
              </html>
            `);
            
            printWindow.document.close();
            printWindow.onload = () => {
              printWindow.print();
              printWindow.close();
            };
          }
        }
      } else {
        // Print current page
        window.print();
      }
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF');
    } finally {
      setIsExporting(null);
    }
  };

  // Export as image (PNG)
  const exportToImage = async () => {
    setIsExporting('image');
    
    try {
      if (elementId) {
        const element = document.getElementById(elementId);
        if (element) {
          // Use html2canvas if available, otherwise fallback to basic screenshot
          if (window.html2canvas) {
            const canvas = await window.html2canvas(element, {
              backgroundColor: '#ffffff',
              scale: 2,
              useCORS: true
            });
            
            canvas.toBlob((blob: Blob | null) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${data.filename || data.title || 'export'}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }
            });
          } else {
            alert('Image export requires html2canvas library. Please install it to use this feature.');
          }
        }
      } else {
        alert('Please specify an element ID for image export');
      }
    } catch (error) {
      console.error('Image export failed:', error);
      alert('Failed to export image');
    } finally {
      setIsExporting(null);
    }
  };

  // Export as Excel (using SheetJS if available)
  const exportToExcel = async () => {
    setIsExporting('excel');
    
    try {
      // Basic Excel export using CSV format with .xlsx extension
      // For full Excel support, you would need SheetJS library
      let csvContent = '';
      
      if (data.headers && data.rows) {
        csvContent = data.headers.join('\t') + '\n';
        csvContent += data.rows.map(row => row.join('\t')).join('\n');
      } else if (data.data) {
        const headers = Object.keys(data.data[0] || {});
        csvContent = headers.join('\t') + '\n';
        csvContent += data.data.map(item => 
          headers.map(header => String(item[header] || '')).join('\t')
        ).join('\n');
      }

      const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${data.filename || data.title || 'export'}.xls`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Excel export failed:', error);
      alert('Failed to export Excel file');
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className={`export-functions ${className}`}>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={exportToCSV}
          isLoading={isExporting === 'csv'}
          leftIcon={<Table />}
          disabled={isExporting !== null}
        >
          CSV
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={exportToExcel}
          isLoading={isExporting === 'excel'}
          leftIcon={<Table />}
          disabled={isExporting !== null}
        >
          Excel
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={exportToJSON}
          isLoading={isExporting === 'json'}
          leftIcon={<FileText />}
          disabled={isExporting !== null}
        >
          JSON
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={exportToPDF}
          isLoading={isExporting === 'pdf'}
          leftIcon={<FileText />}
          disabled={isExporting !== null}
        >
          PDF
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={exportToImage}
          isLoading={isExporting === 'image'}
          leftIcon={<Image />}
          disabled={isExporting !== null}
        >
          PNG
        </Button>
      </div>
      
      {data.data && data.data.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          Ready to export {data.data.length} records
        </p>
      )}
    </div>
  );
};

export default ExportFunctions;