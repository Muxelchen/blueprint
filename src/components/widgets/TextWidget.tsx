import React, { useState } from 'react';
import { Type, Copy, Download, Palette, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TextWidgetProps {
  title?: string;
  content?: string;
  allowFormatting?: boolean;
  showToolbar?: boolean;
  editable?: boolean;
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textColor?: string;
  backgroundColor?: string;
  className?: string;
  height?: number | string;
  maxLength?: number;
  placeholder?: string;
  onContentChange?: (content: string) => void;
  onSave?: (content: string) => void;
  showCharacterCount?: boolean;
  enableCopy?: boolean;
  enableDownload?: boolean;
  theme?: 'light' | 'dark';
}

const TextWidget: React.FC<TextWidgetProps> = ({
  title = 'Text Widget',
  content: initialContent = '',
  allowFormatting = true,
  showToolbar = true,
  editable = false,
  fontSize = 'base',
  fontWeight = 'normal',
  textAlign = 'left',
  textColor,
  backgroundColor,
  className = '',
  height = 200,
  maxLength,
  placeholder = 'Enter your text here...',
  onContentChange,
  onSave,
  showCharacterCount = false,
  enableCopy = true,
  enableDownload = false,
  theme = 'light'
}) => {
  const [content, setContent] = useState(initialContent);
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);
  const [currentFontWeight, setCurrentFontWeight] = useState(fontWeight);
  const [currentTextAlign, setCurrentTextAlign] = useState(textAlign);
  const [currentTextColor, setCurrentTextColor] = useState(textColor || (theme === 'dark' ? '#ffffff' : '#000000'));
  const [currentBackgroundColor, setCurrentBackgroundColor] = useState(backgroundColor || 'transparent');

  const handleContentChange = (newContent: string) => {
    if (maxLength && newContent.length > maxLength) {
      return;
    }
    setContent(newContent);
    onContentChange?.(newContent);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-content.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    onSave?.(content);
  };

  const fontSizeClasses = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };

  const fontWeightClasses = {
    'normal': 'font-normal',
    'medium': 'font-medium',
    'semibold': 'font-semibold',
    'bold': 'font-bold'
  };

  const textAlignClasses = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right',
    'justify': 'text-justify'
  };

  const containerClass = `${className} ${
    theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
  } border rounded-lg overflow-hidden`;

  const textStyles = {
    color: currentTextColor,
    backgroundColor: currentBackgroundColor === 'transparent' ? undefined : currentBackgroundColor,
  };

  const characterCount = content.length;
  const isOverLimit = maxLength ? characterCount > maxLength : false;

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center space-x-2">
          <Type className="w-5 h-5" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        
        {showToolbar && (
          <div className="flex items-center space-x-2">
            {/* Formatting Controls */}
            {allowFormatting && (
              <>
                {/* Font Size */}
                <select
                  value={currentFontSize}
                  onChange={(e) => setCurrentFontSize(e.target.value as any)}
                  className={`px-2 py-1 text-sm border rounded ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="xs">XS</option>
                  <option value="sm">SM</option>
                  <option value="base">Base</option>
                  <option value="lg">LG</option>
                  <option value="xl">XL</option>
                  <option value="2xl">2XL</option>
                  <option value="3xl">3XL</option>
                </select>

                {/* Font Weight */}
                <select
                  value={currentFontWeight}
                  onChange={(e) => setCurrentFontWeight(e.target.value as any)}
                  className={`px-2 py-1 text-sm border rounded ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="semibold">Semibold</option>
                  <option value="bold">Bold</option>
                </select>

                {/* Text Alignment */}
                <div className="flex items-center border rounded overflow-hidden">
                  <button
                    onClick={() => setCurrentTextAlign('left')}
                    className={`p-1 ${
                      currentTextAlign === 'left' 
                        ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentTextAlign('center')}
                    className={`p-1 ${
                      currentTextAlign === 'center' 
                        ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentTextAlign('right')}
                    className={`p-1 ${
                      currentTextAlign === 'right' 
                        ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Color Pickers */}
                <div className="flex items-center space-x-1">
                  <input
                    type="color"
                    value={currentTextColor}
                    onChange={(e) => setCurrentTextColor(e.target.value)}
                    className="w-8 h-8 rounded border cursor-pointer"
                    title="Text Color"
                  />
                  <input
                    type="color"
                    value={currentBackgroundColor === 'transparent' ? '#ffffff' : currentBackgroundColor}
                    onChange={(e) => setCurrentBackgroundColor(e.target.value)}
                    className="w-8 h-8 rounded border cursor-pointer"
                    title="Background Color"
                  />
                  <button
                    onClick={() => setCurrentBackgroundColor('transparent')}
                    className={`px-2 py-1 text-xs rounded ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                    }`}
                    title="Transparent Background"
                  >
                    Clear
                  </button>
                </div>
              </>
            )}

            {/* Action Buttons */}
            {enableCopy && (
              <button
                onClick={handleCopy}
                className={`p-2 rounded hover:bg-opacity-20 ${
                  theme === 'dark' ? 'hover:bg-white' : 'hover:bg-gray-900'
                }`}
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
            
            {enableDownload && (
              <button
                onClick={handleDownload}
                className={`p-2 rounded hover:bg-opacity-20 ${
                  theme === 'dark' ? 'hover:bg-white' : 'hover:bg-gray-900'
                }`}
                title="Download as .txt file"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            
            {onSave && editable && (
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Save
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4" style={{ height }}>
        {editable ? (
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full h-full resize-none outline-none ${
              fontSizeClasses[currentFontSize]
            } ${
              fontWeightClasses[currentFontWeight]
            } ${
              textAlignClasses[currentTextAlign]
            } ${
              theme === 'dark' 
                ? 'bg-gray-800 text-gray-100 placeholder-gray-400' 
                : 'bg-transparent text-gray-900 placeholder-gray-500'
            }`}
            style={textStyles}
            maxLength={maxLength}
          />
        ) : (
          <div
            className={`w-full h-full overflow-auto ${
              fontSizeClasses[currentFontSize]
            } ${
              fontWeightClasses[currentFontWeight]
            } ${
              textAlignClasses[currentTextAlign]
            }`}
            style={textStyles}
          >
            {content ? (
              <pre className="whitespace-pre-wrap font-inherit">{content}</pre>
            ) : (
              <div className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              } italic`}>
                {placeholder}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {(showCharacterCount || maxLength) && (
        <div className={`flex items-center justify-between px-4 py-2 border-t text-sm ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          {showCharacterCount && (
            <div className={`${
              isOverLimit ? 'text-red-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Characters: {characterCount}
              {maxLength && ` / ${maxLength}`}
            </div>
          )}
          
          {maxLength && isOverLimit && (
            <div className="text-red-500 text-xs">
              Exceeds maximum length by {characterCount - maxLength} characters
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TextWidget; 