import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Undo,
  Redo,
  Type,
  Palette,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
} from 'lucide-react';

export interface RichTextEditorProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  height?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  showToolbar?: boolean;
  showStatusBar?: boolean;
  autoFocus?: boolean;
  spellCheck?: boolean;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  variant?: 'default' | 'minimal' | 'full';
  size?: 'sm' | 'md' | 'lg';
  toolbarPosition?: 'top' | 'bottom';
  enabledFeatures?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    alignment?: boolean;
    lists?: boolean;
    links?: boolean;
    images?: boolean;
    code?: boolean;
    quote?: boolean;
    undo?: boolean;
    colors?: boolean;
    fontSize?: boolean;
  };
  onChange?: (html: string, text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSelectionChange?: (selection: Selection | null) => void;
  className?: string;
  editorClassName?: string;
  toolbarClassName?: string;
  name?: string;
  id?: string;
}

export interface RichTextEditorState {
  content: string;
  textContent: string;
  isFocused: boolean;
  isPreview: boolean;
  isFullscreen: boolean;
  selection: Selection | null;
  history: string[];
  historyIndex: number;
  wordCount: number;
  charCount: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value: controlledValue,
  defaultValue = '',
  placeholder = 'Start typing...',
  disabled = false,
  readOnly = false,
  height = '300px',
  minHeight = '200px',
  maxHeight,
  showToolbar = true,
  showStatusBar = true,
  autoFocus = false,
  spellCheck = true,
  label,
  description,
  error,
  required = false,
  size = 'md',
  toolbarPosition = 'top',
  enabledFeatures = {
    bold: true,
    italic: true,
    underline: true,
    strikethrough: true,
    alignment: true,
    lists: true,
    links: true,
    images: true,
    code: true,
    quote: true,
    undo: true,
    colors: true,
    fontSize: true,
  },
  onChange,
  onFocus,
  onBlur,
  onSelectionChange,
  className = '',
  editorClassName = '',
  toolbarClassName = '',
  name,
  id,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isControlled = controlledValue !== undefined;

  const [state, setState] = useState<RichTextEditorState>({
    content: controlledValue || defaultValue,
    textContent: '',
    isFocused: false,
    isPreview: false,
    isFullscreen: false,
    selection: null,
    history: [controlledValue || defaultValue],
    historyIndex: 0,
    wordCount: 0,
    charCount: 0,
  });

  // Update content when controlled value changes
  useEffect(() => {
    if (isControlled && controlledValue !== state.content) {
      setState(prev => ({
        ...prev,
        content: controlledValue || '',
        textContent: getTextContent(controlledValue || ''),
        wordCount: getWordCount(controlledValue || ''),
        charCount: getCharCount(controlledValue || ''),
      }));

      if (editorRef.current) {
        editorRef.current.innerHTML = controlledValue || '';
      }
    }
  }, [controlledValue, isControlled, state.content]);

  // Auto focus
  useEffect(() => {
    if (autoFocus && editorRef.current) {
      editorRef.current.focus();
    }
  }, [autoFocus]);

  // Handle fullscreen escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isFullscreen) {
        setState(prev => ({ ...prev, isFullscreen: false }));
      }
    };

    if (state.isFullscreen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [state.isFullscreen]);

  // Utility functions
  const getTextContent = useCallback((html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }, []);

  const getWordCount = useCallback(
    (html: string): number => {
      const text = getTextContent(html);
      return text.trim() ? text.trim().split(/\s+/).length : 0;
    },
    [getTextContent]
  );

  const getCharCount = useCallback(
    (html: string): number => {
      return getTextContent(html).length;
    },
    [getTextContent]
  );

  // Update content and stats
  const updateContent = useCallback(
    (newContent: string, addToHistory = true) => {
      const textContent = getTextContent(newContent);
      const wordCount = getWordCount(newContent);
      const charCount = getCharCount(newContent);

      if (!isControlled) {
        setState(prev => {
          const newState = {
            ...prev,
            content: newContent,
            textContent,
            wordCount,
            charCount,
          };

          if (addToHistory && newContent !== prev.content) {
            const newHistory = prev.history.slice(0, prev.historyIndex + 1);
            newHistory.push(newContent);
            newState.history = newHistory.slice(-50); // Keep last 50 states
            newState.historyIndex = newState.history.length - 1;
          }

          return newState;
        });
      }

      onChange?.(newContent, textContent);
    },
    [isControlled, onChange, getTextContent, getWordCount, getCharCount]
  );

  // Editor event handlers
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      updateContent(content);
    }
  }, [updateContent]);

  const handleFocus = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: true }));
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: false }));
    onBlur?.();
  }, [onBlur]);

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    setState(prev => ({ ...prev, selection }));
    onSelectionChange?.(selection);
  }, [onSelectionChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          break;
        case 'y':
          e.preventDefault();
          handleRedo();
          break;
      }
    }

    // Handle tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      execCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
  }, []);

  // Command execution
  const execCommand = useCallback(
    (command: string, value?: string) => {
      if (disabled || readOnly) return;

      document.execCommand(command, false, value);

      if (editorRef.current) {
        const content = editorRef.current.innerHTML;
        updateContent(content);
      }

      editorRef.current?.focus();
    },
    [disabled, readOnly, updateContent]
  );

  // Toolbar actions
  const handleBold = () => execCommand('bold');
  const handleItalic = () => execCommand('italic');
  const handleUnderline = () => execCommand('underline');
  const handleStrikethrough = () => execCommand('strikeThrough');

  const handleAlignment = (align: string) => {
    const commands = {
      left: 'justifyLeft',
      center: 'justifyCenter',
      right: 'justifyRight',
      justify: 'justifyFull',
    };
    execCommand(commands[align as keyof typeof commands]);
  };

  const handleList = (type: 'ul' | 'ol') => {
    execCommand(type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList');
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const handleCode = () => {
    execCommand('formatBlock', 'pre');
  };

  const handleQuote = () => {
    execCommand('formatBlock', 'blockquote');
  };

  const handleFontSize = (size: string) => {
    execCommand('fontSize', size);
  };

  const handleTextColor = (color: string) => {
    execCommand('foreColor', color);
  };

  const handleBackgroundColor = (color: string) => {
    execCommand('backColor', color);
  };

  const handleUndo = () => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      const content = state.history[newIndex];

      setState(prev => ({ ...prev, historyIndex: newIndex }));

      if (editorRef.current) {
        editorRef.current.innerHTML = content;
      }

      updateContent(content, false);
    }
  };

  const handleRedo = () => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      const content = state.history[newIndex];

      setState(prev => ({ ...prev, historyIndex: newIndex }));

      if (editorRef.current) {
        editorRef.current.innerHTML = content;
      }

      updateContent(content, false);
    }
  };

  const togglePreview = () => {
    setState(prev => ({ ...prev, isPreview: !prev.isPreview }));
  };

  const toggleFullscreen = () => {
    setState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  };

  // Check if command is active
  const isCommandActive = useCallback((command: string): boolean => {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  }, []);

  // Size configurations
  const getSizeConfig = () => {
    const configs = {
      sm: {
        toolbar: 'px-2 py-1',
        button: 'w-6 h-6 p-1',
        icon: 'w-3 h-3',
        text: 'text-sm',
      },
      md: {
        toolbar: 'px-3 py-2',
        button: 'w-8 h-8 p-1.5',
        icon: 'w-4 h-4',
        text: 'text-base',
      },
      lg: {
        toolbar: 'px-4 py-3',
        button: 'w-10 h-10 p-2',
        icon: 'w-5 h-5',
        text: 'text-lg',
      },
    };
    return configs[size];
  };

  const sizeConfig = getSizeConfig();
  const editorId = id || name || `rich-text-editor-${Math.random().toString(36).substr(2, 9)}`;

  // Toolbar button component
  const ToolbarButton: React.FC<{
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }> = ({ onClick, active, disabled, title, children }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        ${sizeConfig.button} rounded transition-colors
        ${active ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {children}
    </button>
  );

  // Color picker component
  const ColorPicker: React.FC<{
    onColorSelect: (color: string) => void;
    title: string;
    icon: React.ReactNode;
  }> = ({ onColorSelect, title, icon }) => {
    const colors = [
      '#000000',
      '#333333',
      '#666666',
      '#999999',
      '#cccccc',
      '#ffffff',
      '#ff0000',
      '#ff8800',
      '#ffff00',
      '#88ff00',
      '#00ff00',
      '#00ff88',
      '#00ffff',
      '#0088ff',
      '#0000ff',
      '#8800ff',
      '#ff00ff',
      '#ff0088',
    ];

    return (
      <div className="relative group">
        <ToolbarButton onClick={() => {}} title={title}>
          {icon}
        </ToolbarButton>
        <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
          <div className="grid grid-cols-6 gap-1">
            {colors.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => onColorSelect(color)}
                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render toolbar
  const renderToolbar = () => {
    if (!showToolbar) return null;

    return (
      <div
        className={`
        border-b border-gray-200 bg-gray-50 flex flex-wrap items-center gap-1
        ${sizeConfig.toolbar} ${toolbarClassName}
      `}
      >
        {/* Text Formatting */}
        {enabledFeatures.bold && (
          <ToolbarButton
            onClick={handleBold}
            active={isCommandActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold className={sizeConfig.icon} />
          </ToolbarButton>
        )}

        {enabledFeatures.italic && (
          <ToolbarButton
            onClick={handleItalic}
            active={isCommandActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic className={sizeConfig.icon} />
          </ToolbarButton>
        )}

        {enabledFeatures.underline && (
          <ToolbarButton
            onClick={handleUnderline}
            active={isCommandActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <Underline className={sizeConfig.icon} />
          </ToolbarButton>
        )}

        {enabledFeatures.strikethrough && (
          <ToolbarButton
            onClick={handleStrikethrough}
            active={isCommandActive('strikeThrough')}
            title="Strikethrough"
          >
            <Strikethrough className={sizeConfig.icon} />
          </ToolbarButton>
        )}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Font Size */}
        {enabledFeatures.fontSize && (
          <select
            onChange={e => handleFontSize(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
            title="Font Size"
          >
            <option value="1">Small</option>
            <option value="3" selected>
              Normal
            </option>
            <option value="5">Large</option>
            <option value="7">Huge</option>
          </select>
        )}

        {/* Colors */}
        {enabledFeatures.colors && (
          <>
            <ColorPicker
              onColorSelect={handleTextColor}
              title="Text Color"
              icon={<Type className={sizeConfig.icon} />}
            />
            <ColorPicker
              onColorSelect={handleBackgroundColor}
              title="Background Color"
              icon={<Palette className={sizeConfig.icon} />}
            />
          </>
        )}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alignment */}
        {enabledFeatures.alignment && (
          <>
            <ToolbarButton
              onClick={() => handleAlignment('left')}
              active={isCommandActive('justifyLeft')}
              title="Align Left"
            >
              <AlignLeft className={sizeConfig.icon} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleAlignment('center')}
              active={isCommandActive('justifyCenter')}
              title="Align Center"
            >
              <AlignCenter className={sizeConfig.icon} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleAlignment('right')}
              active={isCommandActive('justifyRight')}
              title="Align Right"
            >
              <AlignRight className={sizeConfig.icon} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleAlignment('justify')}
              active={isCommandActive('justifyFull')}
              title="Justify"
            >
              <AlignJustify className={sizeConfig.icon} />
            </ToolbarButton>
          </>
        )}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        {enabledFeatures.lists && (
          <>
            <ToolbarButton
              onClick={() => handleList('ul')}
              active={isCommandActive('insertUnorderedList')}
              title="Bullet List"
            >
              <List className={sizeConfig.icon} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleList('ol')}
              active={isCommandActive('insertOrderedList')}
              title="Numbered List"
            >
              <ListOrdered className={sizeConfig.icon} />
            </ToolbarButton>
          </>
        )}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Insert */}
        {enabledFeatures.links && (
          <ToolbarButton onClick={handleLink} title="Insert Link">
            <Link className={sizeConfig.icon} />
          </ToolbarButton>
        )}

        {enabledFeatures.images && (
          <ToolbarButton onClick={handleImage} title="Insert Image">
            <Image className={sizeConfig.icon} />
          </ToolbarButton>
        )}

        {/* Format */}
        {enabledFeatures.code && (
          <ToolbarButton onClick={handleCode} title="Code Block">
            <Code className={sizeConfig.icon} />
          </ToolbarButton>
        )}

        {enabledFeatures.quote && (
          <ToolbarButton onClick={handleQuote} title="Quote">
            <Quote className={sizeConfig.icon} />
          </ToolbarButton>
        )}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* History */}
        {enabledFeatures.undo && (
          <>
            <ToolbarButton
              onClick={handleUndo}
              disabled={state.historyIndex <= 0}
              title="Undo (Ctrl+Z)"
            >
              <Undo className={sizeConfig.icon} />
            </ToolbarButton>
            <ToolbarButton
              onClick={handleRedo}
              disabled={state.historyIndex >= state.history.length - 1}
              title="Redo (Ctrl+Y)"
            >
              <Redo className={sizeConfig.icon} />
            </ToolbarButton>
          </>
        )}

        <div className="flex-1" />

        {/* View Controls */}
        <ToolbarButton
          onClick={togglePreview}
          active={state.isPreview}
          title={state.isPreview ? 'Edit Mode' : 'Preview Mode'}
        >
          {state.isPreview ? (
            <EyeOff className={sizeConfig.icon} />
          ) : (
            <Eye className={sizeConfig.icon} />
          )}
        </ToolbarButton>

        <ToolbarButton
          onClick={toggleFullscreen}
          active={state.isFullscreen}
          title={state.isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {state.isFullscreen ? (
            <Minimize className={sizeConfig.icon} />
          ) : (
            <Maximize className={sizeConfig.icon} />
          )}
        </ToolbarButton>
      </div>
    );
  };

  // Render status bar
  const renderStatusBar = () => {
    if (!showStatusBar) return null;

    return (
      <div
        className={`
        border-t border-gray-200 bg-gray-50 flex items-center justify-between
        px-3 py-1 text-xs text-gray-500
      `}
      >
        <div className="flex items-center space-x-4">
          <span>{state.wordCount} words</span>
          <span>{state.charCount} characters</span>
        </div>

        {state.isFocused && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Editing</span>
          </div>
        )}
      </div>
    );
  };

  const containerClasses = `
    ${
      state.isFullscreen
        ? 'fixed inset-0 z-50 bg-white'
        : 'border border-gray-300 rounded-lg overflow-hidden'
    }
    ${error ? 'border-red-300' : state.isFocused ? 'border-blue-500 ring-1 ring-blue-500' : ''}
    ${className}
  `;

  const editorClasses = `
    w-full outline-none overflow-y-auto resize-none
    ${sizeConfig.text}
    ${disabled || readOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
    ${editorClassName}
  `;

  const editorHeight = state.isFullscreen
    ? 'calc(100vh - 120px)'
    : typeof height === 'number'
      ? `${height}px`
      : height;

  return (
    <div className={`space-y-1 ${state.isFullscreen ? '' : className}`}>
      {/* Label */}
      {label && !state.isFullscreen && (
        <label
          htmlFor={editorId}
          className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Description */}
      {description && !error && !state.isFullscreen && (
        <p className={`text-xs ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
      )}

      {/* Editor Container */}
      <div ref={containerRef} className={containerClasses}>
        {/* Toolbar */}
        {toolbarPosition === 'top' && renderToolbar()}

        {/* Editor */}
        <div className="relative">
          {state.isPreview ? (
            <div
              className={`p-3 prose max-w-none ${editorClasses}`}
              style={{
                height: editorHeight,
                minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
                maxHeight: maxHeight
                  ? typeof maxHeight === 'number'
                    ? `${maxHeight}px`
                    : maxHeight
                  : undefined,
              }}
              dangerouslySetInnerHTML={{ __html: state.content }}
            />
          ) : (
            <div
              ref={editorRef}
              contentEditable={!disabled && !readOnly}
              suppressContentEditableWarning
              className={`p-3 ${editorClasses}`}
              style={{
                height: editorHeight,
                minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
                maxHeight: maxHeight
                  ? typeof maxHeight === 'number'
                    ? `${maxHeight}px`
                    : maxHeight
                  : undefined,
              }}
              onInput={handleInput}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onMouseUp={handleSelectionChange}
              onKeyUp={handleSelectionChange}
              onKeyDown={handleKeyDown}
              spellCheck={spellCheck}
              data-placeholder={placeholder}
              dangerouslySetInnerHTML={{ __html: state.content }}
            />
          )}

          {/* Placeholder */}
          {!state.content && !state.isFocused && !state.isPreview && (
            <div
              className={`
              absolute top-3 left-3 pointer-events-none text-gray-400
              ${sizeConfig.text}
            `}
            >
              {placeholder}
            </div>
          )}
        </div>

        {/* Bottom Toolbar */}
        {toolbarPosition === 'bottom' && renderToolbar()}

        {/* Status Bar */}
        {renderStatusBar()}
      </div>

      {/* Error Message */}
      {error && !state.isFullscreen && <p className="text-xs text-red-600">{error}</p>}

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={state.content} />
    </div>
  );
};

// Hook for managing rich text editor state
export const useRichTextEditor = (initialContent?: string) => {
  const [content, setContent] = useState(initialContent || '');
  const [textContent, setTextContent] = useState('');

  const updateContent = useCallback((html: string, text: string) => {
    setContent(html);
    setTextContent(text);
  }, []);

  const clear = useCallback(() => {
    setContent('');
    setTextContent('');
  }, []);

  const insertText = useCallback((text: string) => {
    setContent(prev => prev + text);
  }, []);

  const insertHTML = useCallback((html: string) => {
    setContent(prev => prev + html);
  }, []);

  return {
    content,
    textContent,
    setContent,
    updateContent,
    clear,
    insertText,
    insertHTML,
  };
};

// Example usage component
export const ExampleRichTextEditors: React.FC = () => {
  const [content1, setContent1] = useState('<p>Welcome to the rich text editor!</p>');
  const [content2, setContent2] = useState('');
  const [content3, setContent3] = useState('');

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Rich Text Editor Examples</h3>

        <div className="space-y-8">
          {/* Full Featured Editor */}
          <div>
            <h4 className="font-medium mb-4">Full Featured Editor</h4>
            <RichTextEditor
              label="Article Content"
              description="Create your article with full formatting options"
              value={content1}
              onChange={html => setContent1(html)}
              height="400px"
              variant="full"
              showStatusBar
              autoFocus
              enabledFeatures={{
                bold: true,
                italic: true,
                underline: true,
                strikethrough: true,
                alignment: true,
                lists: true,
                links: true,
                images: true,
                code: true,
                quote: true,
                undo: true,
                colors: true,
                fontSize: true,
              }}
            />
          </div>

          {/* Minimal Editor */}
          <div>
            <h4 className="font-medium mb-4">Minimal Editor</h4>
            <RichTextEditor
              label="Simple Note"
              description="Basic text editing with minimal features"
              value={content2}
              onChange={html => setContent2(html)}
              height="200px"
              variant="minimal"
              size="sm"
              enabledFeatures={{
                bold: true,
                italic: true,
                underline: false,
                strikethrough: false,
                alignment: false,
                lists: true,
                links: false,
                images: false,
                code: false,
                quote: false,
                undo: true,
                colors: false,
                fontSize: false,
              }}
            />
          </div>

          {/* Comment Editor */}
          <div>
            <h4 className="font-medium mb-4">Comment Editor</h4>
            <RichTextEditor
              label="Add Comment"
              placeholder="Write your comment here..."
              value={content3}
              onChange={html => setContent3(html)}
              height="150px"
              showStatusBar={false}
              toolbarPosition="bottom"
              enabledFeatures={{
                bold: true,
                italic: true,
                underline: false,
                strikethrough: true,
                alignment: false,
                lists: false,
                links: true,
                images: false,
                code: true,
                quote: true,
                undo: false,
                colors: false,
                fontSize: false,
              }}
            />
          </div>

          {/* Different Sizes */}
          <div>
            <h4 className="font-medium mb-4">Size Variants</h4>
            <div className="space-y-4">
              <RichTextEditor
                label="Small Editor"
                size="sm"
                height="120px"
                placeholder="Small editor..."
              />

              <RichTextEditor
                label="Medium Editor"
                size="md"
                height="120px"
                placeholder="Medium editor..."
              />

              <RichTextEditor
                label="Large Editor"
                size="lg"
                height="120px"
                placeholder="Large editor..."
              />
            </div>
          </div>

          {/* States */}
          <div>
            <h4 className="font-medium mb-4">Different States</h4>
            <div className="space-y-4">
              <RichTextEditor
                label="Read Only"
                value="<p>This content is <strong>read-only</strong> and cannot be edited.</p>"
                readOnly
                height="100px"
              />

              <RichTextEditor
                label="Disabled"
                placeholder="This editor is disabled..."
                disabled
                height="100px"
              />

              <RichTextEditor
                label="Error State"
                error="Content is required"
                required
                height="100px"
                placeholder="This has an error..."
              />
            </div>
          </div>
        </div>

        {/* Content Display */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Editor Content</h4>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Full Editor HTML:</strong>
              <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                {content1 || 'No content'}
              </pre>
            </div>
            <div>
              <strong>Minimal Editor HTML:</strong>
              <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                {content2 || 'No content'}
              </pre>
            </div>
            <div>
              <strong>Comment Editor HTML:</strong>
              <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                {content3 || 'No content'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
