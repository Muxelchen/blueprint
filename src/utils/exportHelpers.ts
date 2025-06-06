// Complete client-side export functions with additional helpers
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

// Base interfaces (extending existing ExportFunctions)
export interface ExportOptions {
  filename?: string;
  format: 'csv' | 'json' | 'xlsx' | 'pdf' | 'png' | 'svg';
  includeHeaders?: boolean;
  delimiter?: string;
  encoding?: string;
}

export interface ChartExportOptions extends ExportOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  scale?: number;
}

export interface TableExportOptions extends ExportOptions {
  includeIndex?: boolean;
  sheetName?: string;
  filterFunction?: (row: any) => boolean;
}

// Data transformation helpers
export const transformDataForExport = (data: any[], format: string): any => {
  switch (format) {
    case 'csv':
      return convertToCSV(data);
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'xlsx':
      return convertToWorkbook(data);
    default:
      return data;
  }
};

export const convertToCSV = (data: any[], delimiter = ','): string => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(delimiter),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        const stringValue = value === null || value === undefined ? '' : String(value);
        // Escape quotes and wrap in quotes if contains delimiter
        if (stringValue.includes(delimiter) || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(delimiter)
    )
  ].join('\n');
  
  return csvContent;
};

export const convertToWorkbook = async (data: any[], sheetName = 'Sheet1'): Promise<ExcelJS.Workbook> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  
  if (data && data.length > 0) {
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);
    
    data.forEach(row => {
      const values = headers.map(header => row[header]);
      worksheet.addRow(values);
    });
    
    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6E6' }
    };
  }
  
  return workbook;
};

// Advanced export functions
export const exportChartAsPNG = async (
  elementId: string, 
  options: ChartExportOptions = { format: 'png' }
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element with id ${elementId} not found`);

  try {
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(element, {
      background: options.backgroundColor || '#ffffff',
      scale: options.scale || 2,
      width: options.width,
      height: options.height,
      useCORS: true,
      allowTaint: false
    } as any);

    canvas.toBlob((blob: Blob | null) => {
      if (blob) {
        saveAs(blob, `${options.filename || 'chart'}.png`);
      }
    }, 'image/png');
  } catch (error) {
    console.error('Failed to export chart as PNG:', error);
    throw error;
  }
};

export const exportChartAsSVG = (elementId: string, options: ChartExportOptions = { format: 'svg' }): void => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element with id ${elementId} not found`);

  const svgElements = element.querySelectorAll('svg');
  if (svgElements.length === 0) throw new Error('No SVG elements found');

  const svgElement = svgElements[0];
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  saveAs(blob, `${options.filename || 'chart'}.svg`);
};

export const exportTableToExcel = async (data: any[], options: TableExportOptions = { format: 'xlsx' }): Promise<void> => {
  let processedData = data;
  
  if (options.filterFunction) {
    processedData = data.filter(options.filterFunction);
  }
  
  const workbook = await convertToWorkbook(processedData, options.sheetName);
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  saveAs(blob, `${options.filename || 'export'}.xlsx`);
};

export const exportMultipleSheets = async (datasets: { name: string; data: any[] }[], filename = 'export'): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  
  for (const { name, data } of datasets) {
    const worksheet = workbook.addWorksheet(name);
    
    if (data && data.length > 0) {
      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);
      
      data.forEach(row => {
        const values = headers.map(header => row[header]);
        worksheet.addRow(values);
      });
      
      // Style the header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6E6' }
      };
    }
  }
  
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  saveAs(blob, `${filename}.xlsx`);
};

// Utility functions for data processing
export const flattenObject = (obj: any, prefix = ''): any => {
  const flattened: any = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }
  
  return flattened;
};

export const generateFileName = (baseName: string, format: string, timestamp = true): string => {
  const cleanName = baseName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const timeStr = timestamp ? `_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}` : '';
  return `${cleanName}${timeStr}.${format}`;
};

export const validateExportData = (data: any): boolean => {
  if (!data) return false;
  if (Array.isArray(data)) return data.length > 0;
  if (typeof data === 'object') return Object.keys(data).length > 0;
  return true;
};

// Batch export functionality
export const batchExport = async (
  exports: Array<{
    data: any;
    filename: string;
    format: ExportOptions['format'];
    options?: Partial<ExportOptions>;
  }>
): Promise<void> => {
  const results = [];
  
  for (const exportConfig of exports) {
    try {
      switch (exportConfig.format) {
        case 'csv':
          const csvData = convertToCSV(exportConfig.data);
          const csvBlob = new Blob([csvData], { type: 'text/csv' });
          saveAs(csvBlob, `${exportConfig.filename}.csv`);
          break;
          
        case 'json':
          const jsonData = JSON.stringify(exportConfig.data, null, 2);
          const jsonBlob = new Blob([jsonData], { type: 'application/json' });
          saveAs(jsonBlob, `${exportConfig.filename}.json`);
          break;
          
        case 'xlsx':
          exportTableToExcel(exportConfig.data, {
            ...exportConfig.options,
            filename: exportConfig.filename,
            format: 'xlsx'
          } as TableExportOptions);
          break;
      }
      
      results.push({ filename: exportConfig.filename, status: 'success' });
    } catch (error) {
      results.push({ filename: exportConfig.filename, status: 'error', error });
    }
  }
  
  console.log('Batch export completed:', results);
};

// Print utilities
export const printElement = (elementId: string, title?: string): void => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Failed to open print window');
    return;
  }

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
        <title>${title || 'Print'}</title>
        <style>
          ${styles}
          @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

// Download helper
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};