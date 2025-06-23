import React, { useState, useMemo } from 'react';
import { Eye, Edit, Download, Copy, Maximize2, Minimize2, Type } from 'lucide-react';

interface MarkdownViewerProps {
  title?: string;
  initialContent?: string;
  showEditor?: boolean;
  editable?: boolean;
  height?: number | string;
  className?: string;
  onContentChange?: (content: string) => void;
  onSave?: (content: string) => void;
  showToolbar?: boolean;
  enableLivePreview?: boolean;
  theme?: 'light' | 'dark';
}

// Simple markdown to HTML converter (basic implementation)
const parseMarkdown = (markdown: string): string => {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
  html = html.replace(/_(.*?)_/gim, '<em>$1</em>');
  
  // Code
  html = html.replace(/`(.*?)`/gim, '<code>$1</code>');
  
  // Code blocks
  html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  
  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
  
  // Line breaks
  html = html.replace(/\n\n/gim, '</p><p>');
  html = html.replace(/\n/gim, '<br>');
  
  // Wrap in paragraphs
  if (!html.startsWith('<h1>') && !html.startsWith('<h2>') && !html.startsWith('<h3>') && !html.startsWith('<ul>') && !html.startsWith('<pre>')) {
    html = `<p>${html}</p>`;
  }
  
  return html;
};

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  title = 'Markdown Viewer',
  initialContent = '# Welcome to Markdown Viewer\n\nStart writing your **markdown** content here...',
  showEditor = true,
  editable = true,
  height = 400,
  className = '',
  onContentChange,
  onSave,
  showToolbar = true,
  enableLivePreview = true,
  theme = 'light'
}) => {
  const [content, setContent] = useState(initialContent);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const htmlContent = useMemo(() => parseMarkdown(content), [content]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onContentChange?.(newContent);
  };

  const handleSave = () => {
    onSave?.(content);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const insertMarkdownSyntax = (syntax: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.slice(start, end);
    
    let newContent = '';
    switch (syntax) {
      case 'bold':
        newContent = content.slice(0, start) + `**${selectedText || 'bold text'}**` + content.slice(end);
        break;
      case 'italic':
        newContent = content.slice(0, start) + `*${selectedText || 'italic text'}*` + content.slice(end);
        break;
      case 'code':
        newContent = content.slice(0, start) + `\`${selectedText || 'code'}\`` + content.slice(end);
        break;
      case 'link':
        newContent = content.slice(0, start) + `[${selectedText || 'link text'}](url)` + content.slice(end);
        break;
      case 'header':
        newContent = content.slice(0, start) + `# ${selectedText || 'Header'}` + content.slice(end);
        break;
      case 'list':
        newContent = content.slice(0, start) + `* ${selectedText || 'List item'}` + content.slice(end);
        break;
      default:
        return;
    }
    
    handleContentChange(newContent);
  };

  const containerHeight = isFullscreen ? '100vh' : height;
  const containerClass = `${className} ${isFullscreen ? 'fixed inset-0 z-50' : 'relative'} ${
    theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
  } border rounded-lg overflow-hidden`;

  return (
    <div className={containerClass} style={{ height: containerHeight }}>
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
            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1 text-sm ${
                  viewMode === 'edit' 
                    ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 text-sm ${
                  viewMode === 'preview' 
                    ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1 text-sm ${
                  viewMode === 'split' 
                    ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Split
              </button>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleCopy}
              className={`p-2 rounded hover:bg-opacity-20 ${
                theme === 'dark' ? 'hover:bg-white' : 'hover:bg-gray-900'
              }`}
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleDownload}
              className={`p-2 rounded hover:bg-opacity-20 ${
                theme === 'dark' ? 'hover:bg-white' : 'hover:bg-gray-900'
              }`}
              title="Download as .md file"
            >
              <Download className="w-4 h-4" />
            </button>
            
            {onSave && (
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Save
              </button>
            )}
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2 rounded hover:bg-opacity-20 ${
                theme === 'dark' ? 'hover:bg-white' : 'hover:bg-gray-900'
              }`}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Markdown Toolbar */}
      {showEditor && viewMode !== 'preview' && (
        <div className={`flex items-center space-x-2 p-2 border-b ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <button
            onClick={() => insertMarkdownSyntax('bold')}
            className={`px-2 py-1 text-xs rounded ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => insertMarkdownSyntax('italic')}
            className={`px-2 py-1 text-xs rounded ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => insertMarkdownSyntax('code')}
            className={`px-2 py-1 text-xs rounded ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Code"
          >
            Code
          </button>
          <button
            onClick={() => insertMarkdownSyntax('link')}
            className={`px-2 py-1 text-xs rounded ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Link"
          >
            Link
          </button>
          <button
            onClick={() => insertMarkdownSyntax('header')}
            className={`px-2 py-1 text-xs rounded ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Header"
          >
            H1
          </button>
          <button
            onClick={() => insertMarkdownSyntax('list')}
            className={`px-2 py-1 text-xs rounded ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="List"
          >
            List
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="flex h-full">
        {/* Editor */}
        {showEditor && viewMode !== 'preview' && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col`}>
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className={`flex-1 p-4 resize-none outline-none font-mono text-sm ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-gray-100 placeholder-gray-400' 
                  : 'bg-white text-gray-900 placeholder-gray-500'
              } ${viewMode === 'split' ? 'border-r' : ''}`}
              placeholder="Write your markdown here..."
              disabled={!editable}
            />
          </div>
        )}

        {/* Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} overflow-auto`}>
            <div 
              className={`p-4 prose max-w-none ${
                theme === 'dark' ? 'prose-invert' : ''
              }`}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              style={{
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownViewer; 