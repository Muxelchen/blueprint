import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Copy,
  Download,
  Maximize,
  Minimize,
  Code,
  FileText,
  Search,
  CheckCircle,
  X,
} from 'lucide-react';

interface CodeData {
  id: string;
  code: string;
  language?: string;
  filename?: string;
  title?: string;
  description?: string;
  author?: string;
  metadata?: {
    lines?: number;
    size?: string;
    framework?: string;
  };
}

interface CodeBlockProps {
  code?: string;
  codeData?: CodeData;
  language?: string;
  theme?: 'light' | 'dark' | 'github' | 'monokai';
  fontSize?: 'small' | 'medium' | 'large';
  showLineNumbers?: boolean;
  enableCopy?: boolean;
  enableDownload?: boolean;
  enableFullscreen?: boolean;
  enableWordWrap?: boolean;
  enableSearch?: boolean;
  maxHeight?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
  onCopy?: (code: string) => void;
  onDownload?: (code: string, filename?: string) => void;
}

const mockCodeData: CodeData = {
  id: '1',
  code: `import React, { useState, useEffect } from 'react';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a todo..."
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;`,
  language: 'javascript',
  filename: 'TodoApp.jsx',
  title: 'React Todo App Component',
  description: 'A simple todo application built with React hooks',
  author: 'Developer',
  metadata: {
    lines: 35,
    size: '1.2 KB',
    framework: 'React',
  },
};

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  codeData,
  language = 'javascript',
  theme = 'dark',
  fontSize = 'medium',
  showLineNumbers = true,
  enableCopy = true,
  enableDownload = true,
  enableFullscreen = true,
  enableWordWrap = false,
  enableSearch = true,
  maxHeight = '500px',
  showHeader = true,
  showFooter = true,
  borderRadius = 'medium',
  shadow = 'medium',
  border = true,
  onCopy,
  onDownload,
}) => {
  const [currentCode, setCurrentCode] = useState(code || codeData?.code || mockCodeData.code);
  const [currentLanguage, setCurrentLanguage] = useState(language || codeData?.language || mockCodeData.language || 'javascript');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [lineCount, setLineCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentData = codeData || mockCodeData;

  // Theme configurations
  const themeConfig = {
    light: {
      bg: 'bg-gray-50',
      codeBg: 'bg-white',
      text: 'text-gray-900',
      border: 'border-gray-200',
      lineNumber: 'text-gray-400',
    },
    dark: {
      bg: 'bg-gray-900',
      codeBg: 'bg-gray-800',
      text: 'text-gray-100',
      border: 'border-gray-700',
      lineNumber: 'text-gray-500',
    },
    github: {
      bg: 'bg-white',
      codeBg: 'bg-gray-50',
      text: 'text-gray-900',
      border: 'border-gray-300',
      lineNumber: 'text-gray-400',
    },
    monokai: {
      bg: 'bg-gray-900',
      codeBg: 'bg-gray-800',
      text: 'text-gray-100',
      border: 'border-gray-600',
      lineNumber: 'text-gray-600',
    },
  };

  const currentTheme = themeConfig[theme];

  const borderRadiusConfig = {
    none: 'rounded-none',
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl',
  };

  const shadowConfig = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg',
  };

  const fontSizeConfig = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  useEffect(() => {
    const lines = currentCode.split('\n').length;
    setLineCount(lines);
  }, [currentCode]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      
      if (onCopy) {
        onCopy(currentCode);
      }
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }, [currentCode, onCopy]);

  const handleDownload = useCallback(() => {
    const filename = currentData.filename || `code.${currentLanguage === 'javascript' ? 'js' : currentLanguage}`;
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    if (onDownload) {
      onDownload(currentCode, filename);
    }
  }, [currentCode, currentData, currentLanguage, onDownload]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

  const renderCode = useCallback(() => {
    const lines = currentCode.split('\n');
    
    return lines.map((line, index) => {
      const lineNumber = index + 1;
      
      return (
        <div key={lineNumber} className="flex">
          {showLineNumbers && (
            <div className={`
              ${currentTheme.lineNumber} 
              ${fontSizeConfig[fontSize]}
              select-none
              text-right
              pr-4
              pl-2
              py-0.5
              min-w-[3rem]
              border-r
              ${currentTheme.border}
            `}>
              {lineNumber}
            </div>
          )}
          
          <pre className={`
            flex-1
            px-4
            py-0.5
            ${fontSizeConfig[fontSize]}
            font-mono
            ${currentTheme.text}
            ${enableWordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'}
            overflow-x-auto
          `}>
            <code>{line}</code>
          </pre>
        </div>
      );
    });
  }, [currentCode, showLineNumbers, fontSize, currentTheme, enableWordWrap]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const containerClasses = `
    ${currentTheme.bg}
    ${borderRadiusConfig[borderRadius]}
    ${shadowConfig[shadow]}
    ${border ? `border ${currentTheme.border}` : ''}
    overflow-hidden
    transition-all duration-300
    ${isFullscreen ? 'fixed inset-0 z-50' : ''}
  `.trim();

  return (
    <div
      ref={containerRef}
      className={containerClasses}
    >
      {/* Header */}
      {showHeader && (
        <div className={`flex items-center justify-between px-4 py-2 border-b ${currentTheme.border} ${currentTheme.bg}`}>
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4" />
            <div className="min-w-0">
              <h3 className="font-medium text-sm truncate">
                {currentData.filename || currentData.title || 'Untitled'}
              </h3>
              {currentData.description && (
                <p className={`text-xs ${currentTheme.lineNumber} truncate`}>
                  {currentData.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {enableSearch && (
              <button
                onClick={() => setShowSearchPanel(!showSearchPanel)}
                className={`p-1 hover:bg-opacity-20 hover:bg-white rounded ${currentTheme.text}`}
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {enableCopy && (
              <button
                onClick={handleCopy}
                className={`p-1 hover:bg-opacity-20 hover:bg-white rounded ${currentTheme.text}`}
                title={isCopied ? 'Copied!' : 'Copy'}
              >
                {isCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            )}

            {enableDownload && (
              <button
                onClick={handleDownload}
                className={`p-1 hover:bg-opacity-20 hover:bg-white rounded ${currentTheme.text}`}
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            {enableFullscreen && (
              <button
                onClick={toggleFullscreen}
                className={`p-1 hover:bg-opacity-20 hover:bg-white rounded ${currentTheme.text}`}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Search Panel */}
      {showSearchPanel && (
        <div className={`flex items-center space-x-2 px-4 py-2 border-b ${currentTheme.border} ${currentTheme.bg}`}>
          <Search className="w-4 h-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in code..."
            className={`flex-1 px-2 py-1 text-sm border rounded ${currentTheme.border} ${currentTheme.bg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            onClick={() => setShowSearchPanel(false)}
            className={`p-1 hover:bg-opacity-20 hover:bg-white rounded ${currentTheme.text}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Code Content */}
      <div 
        className={`${currentTheme.codeBg} overflow-auto`}
        style={{
          maxHeight: isFullscreen ? 'calc(100vh - 120px)' : maxHeight,
        }}
      >
        <pre className="w-full">
          {renderCode()}
        </pre>
      </div>

      {/* Footer */}
      {showFooter && (
        <div className={`flex items-center justify-between px-4 py-2 border-t ${currentTheme.border} ${currentTheme.bg}`}>
          <div className="flex items-center space-x-4 text-sm">
            <span className={currentTheme.lineNumber}>
              {lineCount} lines
            </span>
            {currentData.metadata?.size && (
              <span className={currentTheme.lineNumber}>
                {currentData.metadata.size}
              </span>
            )}
            <span className={currentTheme.lineNumber}>
              {currentLanguage}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            {currentData.author && (
              <span className={currentTheme.lineNumber}>
                by {currentData.author}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
