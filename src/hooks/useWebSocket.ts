import { useEffect, useState, useRef, useCallback } from 'react';
import WebSocketService, { WebSocketMessage, WebSocketOptions } from '../utils/websocketService';

interface UseWebSocketOptions extends WebSocketOptions {
  url: string;
  autoConnect?: boolean;
  userId?: string;
}

interface UseWebSocketReturn {
  connected: boolean;
  connecting: boolean;
  messages: WebSocketMessage[];
  send: (type: string, payload?: any) => void;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
  connect: (userId?: string) => void;
  disconnect: () => void;
  clearMessages: () => void;
  lastMessage: WebSocketMessage | null;
  connectionAttempts: number;
}

/**
 * A hook for using WebSocket connections in React components
 * 
 * @example
 * ```tsx
 * const { connected, messages, send, subscribe } = useWebSocket({
 *   url: 'wss://api.example.com/ws',
 *   autoConnect: true,
 *   userId: 'user-123',
 * });
 * 
 * // Subscribe to a channel
 * useEffect(() => {
 *   if (connected) {
 *     subscribe('notifications');
 *   }
 * }, [connected, subscribe]);
 * 
 * // Send a message
 * const handleClick = () => {
 *   send('CHAT_MESSAGE', { text: 'Hello!' });
 * };
 * ```
 */
export function useWebSocket({
  url,
  autoConnect = true,
  userId,
  ...options
}: UseWebSocketOptions): UseWebSocketReturn {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  const serviceRef = useRef<WebSocketService | null>(null);

  // Initialize the WebSocket service on mount
  useEffect(() => {
    // Create WebSocket service instance
    serviceRef.current = new WebSocketService(url, {
      ...options,
      debug: process.env.NODE_ENV === 'development' || options.debug,
      onOpen: () => {
        setConnected(true);
        setConnecting(false);
        setConnectionAttempts(0);
        if (options.onOpen) options.onOpen();
      },
      onClose: () => {
        setConnected(false);
        if (options.onClose) options.onClose();
      },
      onError: (error) => {
        setConnecting(false);
        if (options.onError) options.onError(error);
      },
      onMessage: (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
        setLastMessage(message);
        if (options.onMessage) options.onMessage(message);
      },
      onReconnect: (attempt) => {
        setConnectionAttempts(attempt);
        setConnecting(true);
        if (options.onReconnect) options.onReconnect(attempt);
      }
    });
    
    // Connect if autoConnect is true
    if (autoConnect) {
      setConnecting(true);
      serviceRef.current.connect(userId);
    }
    
    // Clean up when component unmounts
    return () => {
      if (serviceRef.current) {
        serviceRef.current.disconnect();
      }
    };
  }, [url]); // Only re-initialize if URL changes

  // Connect to the WebSocket
  const connect = useCallback((newUserId?: string) => {
    if (serviceRef.current) {
      setConnecting(true);
      serviceRef.current.connect(newUserId ?? userId);
    }
  }, [userId]);

  // Disconnect from the WebSocket
  const disconnect = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.disconnect();
      setConnected(false);
      setConnecting(false);
    }
  }, []);

  // Send a message through the WebSocket
  const send = useCallback((type: string, payload: any = {}) => {
    if (serviceRef.current) {
      serviceRef.current.send(type, payload);
    }
  }, []);

  // Subscribe to a channel
  const subscribe = useCallback((channel: string) => {
    if (serviceRef.current) {
      serviceRef.current.subscribe(channel);
    }
  }, []);

  // Unsubscribe from a channel
  const unsubscribe = useCallback((channel: string) => {
    if (serviceRef.current) {
      serviceRef.current.unsubscribe(channel);
    }
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setLastMessage(null);
  }, []);

  return {
    connected,
    connecting,
    messages,
    lastMessage,
    send,
    subscribe,
    unsubscribe,
    connect,
    disconnect,
    clearMessages,
    connectionAttempts
  };
}

export default useWebSocket;