import { useState, useCallback } from 'react';

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