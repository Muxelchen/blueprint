import React, { useState } from 'react';
import { Printer } from 'lucide-react';
import Button from './Button';

export interface PrintButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  printableElementId?: string;
  className?: string;
  children?: React.ReactNode;
}

const PrintButton: React.FC<PrintButtonProps> = ({
  variant = 'outline',
  size = 'md',
  printableElementId,
  className = '',
  children = 'Print',
  ...props
}) => {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);

    try {
      if (printableElementId) {
        // Print specific element
        const element = document.getElementById(printableElementId);
        if (element) {
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            // Copy styles from parent document
            const styles = Array.from(document.styleSheets)
              .map(styleSheet => {
                try {
                  return Array.from(styleSheet.cssRules)
                    .map(rule => rule.cssText)
                    .join('\n');
                } catch (e) {
                  // Handle cross-origin stylesheets
                  return '';
                }
              })
              .join('\n');

            printWindow.document.write(`
              <!DOCTYPE html>
              <html>
                <head>
                  <title>Print - ${document.title}</title>
                  <style>
                    ${styles}
                    body { 
                      margin: 0; 
                      padding: 20px; 
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    }
                    @media print {
                      body { margin: 0; padding: 0; }
                      .no-print { display: none !important; }
                      .print-break { page-break-before: always; }
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
                    <h1>${document.title}</h1>
                    <p>Printed on ${new Date().toLocaleString()}</p>
                  </div>
                  ${element.outerHTML}
                  <div class="print-footer">
                    <p>Generated from Dashboard • ${window.location.hostname}</p>
                  </div>
                </body>
              </html>
            `);

            printWindow.document.close();

            // Wait for content to load then print
            printWindow.onload = () => {
              printWindow.print();
              printWindow.close();
            };
          }
        } else {
          console.warn(`Element with ID "${printableElementId}" not found`);
          window.print();
        }
      } else {
        // Print entire page
        window.print();
      }
    } catch (error) {
      console.error('Print failed:', error);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePrint}
      isLoading={isPrinting}
      leftIcon={<Printer />}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PrintButton;
