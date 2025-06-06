// @ts-nocheck
import { v4 as uuidv4 } from 'uuid';
import { WebSocketMessage } from './websocketService';

/**
 * Mock WebSocket server class for development and testing
 * Creates a simulated WebSocket server that sends mock data
 */
export class MockWebSocketServer {
  private static instance: MockWebSocketServer;
  private connections: Set<WebSocket> = new Set();
  private subscriptions: Map<string, Set<WebSocket>> = new Map();
  private timers: Map<string, number> = new Map();
  private isRunning = false;
  private userIds: Map<WebSocket, string> = new Map();
  private interval: number | null = null;
  private listeners: Map<string, (message: WebSocketMessage) => void> = new Map();
  private channels: Set<string> = new Set();

  // Private constructor (singleton pattern)
  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): MockWebSocketServer {
    if (!MockWebSocketServer.instance) {
      MockWebSocketServer.instance = new MockWebSocketServer();
    }
    return MockWebSocketServer.instance;
  }

  /**
   * Start the mock server
   */
  public start(intervalMs = 1000): void {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('[MockWebSocketServer] Started');
    
    // Override the WebSocket constructor for mock behavior
    const originalWebSocket = window.WebSocket;
    
    // @ts-ignore - Overriding WebSocket constructor
    window.WebSocket = function(url: string, protocols?: string | string[]) {
      const mockSocket = new MockWebSocket(url);
      MockWebSocketServer.getInstance().registerConnection(mockSocket, url);
      return mockSocket;
    };
    
    // Store original for cleanup
    (window as any).originalWebSocket = originalWebSocket;
    
    // Add default channels
    this.channels.add('system-metrics');
    
    this.interval = setInterval(() => {
      this.broadcastMockData();
    }, intervalMs);
  }

  /**
   * Stop the mock server
   */
  public stop(): void {
    if (!this.isRunning) return;
    
    // Restore original WebSocket constructor
    if ((window as any).originalWebSocket) {
      window.WebSocket = (window as any).originalWebSocket;
      delete (window as any).originalWebSocket;
    }
    
    // Clear all timers
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.connections.clear();
    this.subscriptions.clear();
    this.userIds.clear();
    this.isRunning = false;
    console.log('[MockWebSocketServer] Stopped');
    
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Register a new connection
   */
  public registerConnection(socket: WebSocket, url: string): void {
    this.connections.add(socket);

    // Check for userId in URL
    const urlObj = new URL(url, window.location.origin);
    const userId = urlObj.searchParams.get('userId');
    if (userId) {
      this.userIds.set(socket, userId);
    }
    
    // Send connection acknowledgment
    setTimeout(() => {
      this.sendToSocket(socket, 'CONNECTED', {
        message: 'Connected to mock WebSocket server',
        userId: userId || null
      });
      
      // Send initial system status data
      if (socket.readyState === WebSocket.OPEN) {
        this.sendToSocket(socket, 'SYSTEM_STATUS', this.generateSystemStatus());
      }
    }, 500);
    
    console.log(`[MockWebSocketServer] New connection, total connections: ${this.connections.size}`);
  }

  /**
   * Remove a connection
   */
  public removeConnection(socket: WebSocket): void {
    // Remove from connections
    this.connections.delete(socket);
    
    // Remove from user IDs
    this.userIds.delete(socket);
    
    // Remove from all subscriptions
    this.subscriptions.forEach((sockets, channel) => {
      sockets.delete(socket);
    });
    
    console.log(`[MockWebSocketServer] Connection closed, remaining connections: ${this.connections.size}`);
  }

  /**
   * Handle a message from a client
   */
  public handleMessage(socket: WebSocket, data: string): void {
    try {
      const message = JSON.parse(data) as WebSocketMessage;
      console.log(`[MockWebSocketServer] Received message: ${message.type}`, message);
      
      switch (message.type) {
        case 'PING':
          this.sendToSocket(socket, 'PONG', { 
            timestamp: Date.now(),
            received: message.timestamp
          });
          break;
        
        case 'SUBSCRIBE':
          this.handleSubscribe(socket, message.payload.channel);
          break;
          
        case 'UNSUBSCRIBE':
          this.handleUnsubscribe(socket, message.payload.channel);
          break;
          
        // Custom message types
        case 'REQUEST_DATA':
          this.handleDataRequest(socket, message.payload);
          break;
          
        default:
          // Echo back unknown message types
          this.sendToSocket(socket, `ECHO_${message.type}`, message.payload);
      }
      
      // Notify listeners about the message
      this.listeners.forEach(listener => {
        listener(message);
      });
      
    } catch (error) {
      console.error('[MockWebSocketServer] Error handling message', error);
    }
  }

  /**
   * Handle subscribe message
   */
  private handleSubscribe(socket: WebSocket, channel: string): void {
    if (!channel) return;
    
    // Create channel if it doesn't exist
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
      
      // Start sending data for this channel
      this.startDataStreamForChannel(channel);
    }
    
    // Add socket to channel
    const subs = this.subscriptions.get(channel)!;
    subs.add(socket);
    
    console.log(`[MockWebSocketServer] Subscription to ${channel}, total subscribers: ${subs.size}`);
    
    // Send acknowledgment
    this.sendToSocket(socket, 'SUBSCRIBED', { 
      channel,
      subscribers: subs.size
    });
    
    // Send initial data based on channel
    this.sendInitialDataForChannel(socket, channel);
  }

  /**
   * Handle unsubscribe message
   */
  private handleUnsubscribe(socket: WebSocket, channel: string): void {
    if (!channel || !this.subscriptions.has(channel)) return;
    
    const subs = this.subscriptions.get(channel)!;
    subs.delete(socket);
    
    console.log(`[MockWebSocketServer] Unsubscribed from ${channel}, remaining subscribers: ${subs.size}`);
    
    // Send acknowledgment
    this.sendToSocket(socket, 'UNSUBSCRIBED', { channel });
    
    // If no more subscribers, stop sending data
    if (subs.size === 0) {
      this.stopDataStreamForChannel(channel);
    }
  }

  /**
   * Handle data request message
   */
  private handleDataRequest(socket: WebSocket, payload: any): void {
    const { dataType, parameters } = payload;
    
    switch (dataType) {
      case 'systemStatus':
        this.sendToSocket(socket, 'SYSTEM_STATUS', this.generateSystemStatus());
        break;
        
      case 'userActivity':
        this.sendToSocket(socket, 'USER_ACTIVITY', this.generateUserActivity(parameters?.count || 10));
        break;
        
      case 'performanceMetrics':
        this.sendToSocket(socket, 'PERFORMANCE_METRICS', this.generatePerformanceMetrics());
        break;
        
      default:
        this.sendToSocket(socket, 'ERROR', { 
          message: `Unknown data type: ${dataType}`,
          originalPayload: payload
        });
    }
  }

  /**
   * Start sending data for a channel
   */
  private startDataStreamForChannel(channel: string): void {
    // Clear any existing timer for this channel
    if (this.timers.has(channel)) {
      clearInterval(this.timers.get(channel)!);
    }
    
    let interval: number;
    
    // Set up data stream based on channel type
    switch (channel) {
      case 'system-metrics':
        interval = 5000;
        this.timers.set(channel, setInterval(() => {
          this.broadcastToChannel(channel, 'SYSTEM_METRICS', this.generateSystemMetrics());
        }, interval));
        break;
        
      case 'user-activity':
        interval = 3000;
        this.timers.set(channel, setInterval(() => {
          this.broadcastToChannel(channel, 'USER_ACTIVITY', this.generateUserActivity(1)[0]);
        }, interval));
        break;
        
      case 'notifications':
        interval = 10000;
        this.timers.set(channel, setInterval(() => {
          if (Math.random() > 0.7) { // Only send notifications sometimes
            this.broadcastToChannel(channel, 'NOTIFICATION', this.generateNotification());
          }
        }, interval));
        break;
        
      case 'stock-prices':
        interval = 2000;
        this.timers.set(channel, setInterval(() => {
          this.broadcastToChannel(channel, 'STOCK_UPDATE', this.generateStockPrices());
        }, interval));
        break;
        
      case 'chat':
        // No regular updates for chat channel
        break;
        
      default:
        // For unknown channels, just send a heartbeat
        interval = 10000;
        this.timers.set(channel, setInterval(() => {
          this.broadcastToChannel(channel, 'HEARTBEAT', { 
            channel, 
            timestamp: Date.now() 
          });
        }, interval));
    }
    
    console.log(`[MockWebSocketServer] Started data stream for channel: ${channel}, interval: ${interval}ms`);
  }

  /**
   * Stop sending data for a channel
   */
  private stopDataStreamForChannel(channel: string): void {
    if (this.timers.has(channel)) {
      clearInterval(this.timers.get(channel)!);
      this.timers.delete(channel);
      console.log(`[MockWebSocketServer] Stopped data stream for channel: ${channel}`);
    }
  }

  /**
   * Send initial data when subscribing to a channel
   */
  private sendInitialDataForChannel(socket: WebSocket, channel: string): void {
    switch (channel) {
      case 'system-metrics':
        this.sendToSocket(socket, 'SYSTEM_METRICS', this.generateSystemMetrics());
        break;
        
      case 'user-activity':
        this.sendToSocket(socket, 'USER_ACTIVITY_HISTORY', {
          activities: this.generateUserActivity(20),
          totalCount: 120
        });
        break;
        
      case 'notifications':
        this.sendToSocket(socket, 'NOTIFICATION_HISTORY', {
          notifications: this.generateNotifications(5),
          unreadCount: 3
        });
        break;
        
      case 'stock-prices':
        this.sendToSocket(socket, 'STOCK_PRICES', this.generateStockPrices());
        break;
    }
  }

  /**
   * Send a message to a specific socket
   */
  private sendToSocket(socket: WebSocket, type: string, payload: any): void {
    if (socket.readyState !== WebSocket.OPEN) return;
    
    const message: WebSocketMessage = {
      id: uuidv4(),
      type,
      payload,
      timestamp: Date.now()
    };
    
    socket.send(JSON.stringify(message));
    console.log(`[MockWebSocketServer] Sent ${type} message to client`);
  }

  /**
   * Broadcast a message to all subscribers of a channel
   */
  private broadcastToChannel(channel: string, type: string, payload: any): void {
    if (!this.subscriptions.has(channel)) return;
    
    const subscribers = this.subscriptions.get(channel)!;
    if (subscribers.size === 0) return;
    
    const message: WebSocketMessage = {
      id: uuidv4(),
      type,
      payload,
      timestamp: Date.now()
    };
    
    let sent = 0;
    subscribers.forEach(socket => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
        sent++;
      }
    });
    
    console.log(`[MockWebSocketServer] Broadcast ${type} to ${sent}/${subscribers.size} subscribers in ${channel}`);
  }

  /**
   * Broadcast a message to all connected clients
   */
  public broadcastToAll(type: string, payload: any): void {
    if (this.connections.size === 0) return;
    
    const message: WebSocketMessage = {
      id: uuidv4(),
      type,
      payload,
      timestamp: Date.now()
    };
    
    let sent = 0;
    this.connections.forEach(socket => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
        sent++;
      }
    });
    
    console.log(`[MockWebSocketServer] Broadcast ${type} to ${sent}/${this.connections.size} connections`);
  }

  /**
   * Register a message listener for all messages
   */
  public addListener(id: string, callback: (message: WebSocketMessage) => void): void {
    this.listeners.set(id, callback);
    console.log(`[MockWebSocketServer] Added listener: ${id}, total listeners: ${this.listeners.size}`);
  }

  /**
   * Remove a message listener
   */
  public removeListener(id: string): void {
    this.listeners.delete(id);
    console.log(`[MockWebSocketServer] Removed listener: ${id}, remaining listeners: ${this.listeners.size}`);
  }

  /**
   * Broadcast mock data periodically
   */
  private broadcastMockData(): void {
    // Iterate through all channels with subscribers
    this.subscriptions.forEach((subscribers, channel) => {
      if (subscribers.size === 0) return;
      
      // Send appropriate data based on channel type
      switch (channel) {
        case 'system-metrics':
          this.broadcastToChannel(channel, 'SYSTEM_METRICS', this.generateSystemMetrics());
          break;
          
        case 'user-activity':
          this.broadcastToChannel(channel, 'USER_ACTIVITY', this.generateUserActivity(1)[0]);
          break;
          
        case 'notifications':
          // Only occasionally send notifications
          if (Math.random() > 0.7) {
            this.broadcastToChannel(channel, 'NOTIFICATION', this.generateNotification());
          }
          break;
          
        case 'stock-prices':
          this.broadcastToChannel(channel, 'STOCK_UPDATE', this.generateStockPrices());
          break;
          
        default:
          // For unknown channels, just send a heartbeat
          this.broadcastToChannel(channel, 'HEARTBEAT', { 
            channel, 
            timestamp: Date.now(),
            message: 'Channel is active'
          });
      }
    });
  }

  /**
   * Generate mock system status
   */
  private generateSystemStatus(): any {
    return {
      status: 'online',
      uptime: Math.floor(Math.random() * 100000),
      version: '1.0.0',
      timestamp: Date.now(),
      environment: 'development',
      connections: this.connections.size,
      activeUsers: Math.floor(Math.random() * 100) + 50
    };
  }

  /**
   * Generate mock system metrics
   */
  private generateSystemMetrics(): any {
    return {
      timestamp: Date.now(),
      cpu: {
        usage: Math.floor(Math.random() * 100),
        temperature: 40 + Math.random() * 20,
        cores: 8
      },
      memory: {
        usage: Math.floor(Math.random() * 100),
        total: 16384,
        used: Math.floor(Math.random() * 16384),
        free: Math.floor(Math.random() * 16384)
      },
      network: {
        usage: Math.floor(Math.random() * 100),
        connections: Math.floor(Math.random() * 100),
        bandwidth: {
          in: Math.floor(Math.random() * 100),
          out: Math.floor(Math.random() * 100)
        }
      },
      disk: {
        usage: Math.floor(Math.random() * 100),
        read: Math.floor(Math.random() * 100),
        write: Math.floor(Math.random() * 100)
      }
    };
  }

  /**
   * Generate mock user activity
   */
  private generateUserActivity(count: number = 1): any[] {
    const activities = [];
    const actions = ['login', 'logout', 'view', 'edit', 'delete', 'create', 'download', 'upload'];
    const resources = ['dashboard', 'settings', 'profile', 'document', 'image', 'video', 'project', 'task'];
    
    for (let i = 0; i < count; i++) {
      activities.push({
        id: uuidv4(),
        userId: `user-${Math.floor(Math.random() * 1000)}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        resource: resources[Math.floor(Math.random() * resources.length)],
        timestamp: Date.now() - Math.floor(Math.random() * 3600000),
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0'
      });
    }
    
    return activities;
  }

  /**
   * Generate mock notification
   */
  private generateNotification(): any {
    const types = ['info', 'warning', 'error', 'success'];
    const titles = ['System Update', 'Security Alert', 'New Message', 'Task Completed', 'Reminder'];
    
    return {
      id: uuidv4(),
      type: types[Math.floor(Math.random() * types.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
      message: `This is a mock notification message #${Math.floor(Math.random() * 1000)}`,
      timestamp: Date.now(),
      read: false,
      actionUrl: '#'
    };
  }
  
  /**
   * Generate mock notifications
   */
  private generateNotifications(count: number = 5): any[] {
    const notifications = [];
    
    for (let i = 0; i < count; i++) {
      notifications.push(this.generateNotification());
    }
    
    return notifications;
  }

  /**
   * Generate mock stock prices
   */
  private generateStockPrices(): any {
    const stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'FB', 'TSLA'];
    const stockData: {[key: string]: any} = {};
    
    stocks.forEach(symbol => {
      const basePrice = {
        'AAPL': 150,
        'MSFT': 300,
        'GOOGL': 2500,
        'AMZN': 3000,
        'FB': 200,
        'TSLA': 700
      }[symbol] || 100;
      
      const change = (Math.random() - 0.5) * 10;
      const price = basePrice + change;
      
      stockData[symbol] = {
        price: price,
        change: change,
        changePercent: (change / basePrice) * 100,
        volume: Math.floor(Math.random() * 10000000)
      };
    });
    
    return {
      timestamp: Date.now(),
      stocks: stockData
    };
  }

  /**
   * Generate mock performance metrics
   */
  private generatePerformanceMetrics(): any {
    return {
      loadTime: Math.random() * 5,
      responseTime: Math.random() * 2,
      requestCount: Math.floor(Math.random() * 1000),
      errorRate: Math.random() * 5,
      activeUsers: Math.floor(Math.random() * 100) + 50,
      serverLoad: Math.floor(Math.random() * 100),
      cacheHitRate: Math.floor(Math.random() * 100),
      timestamp: Date.now()
    };
  }
}

/**
 * Mock WebSocket implementation
 * This class mocks the browser's WebSocket API
 */
class MockWebSocket implements WebSocket {
  private mockServer: MockWebSocketServer;
  public url: string;
  public readyState: number = WebSocket.CONNECTING;
  public binaryType: BinaryType = 'blob';
  
  // Event handlers
  public onopen: ((this: WebSocket, ev: Event) => any) | null = null;
  public onclose: ((this: WebSocket, ev: CloseEvent) => any) | null = null;
  public onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null = null;
  public onerror: ((this: WebSocket, ev: Event) => any) | null = null;
  
  // Event target implementation
  private listeners: {[key: string]: EventListener[]} = {};

  constructor(url: string) {
    this.url = url;
    this.mockServer = MockWebSocketServer.getInstance();
    
    // Simulate connection delay
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      
      // Dispatch open event
      const openEvent = new Event('open');
      this.dispatchEvent(openEvent);
      if (this.onopen) this.onopen.call(this, openEvent);
      
    }, 100 + Math.random() * 200); // Random delay between 100-300ms
  }

  public close(code?: number, reason?: string): void {
    if (this.readyState === WebSocket.CLOSED) return;
    
    this.readyState = WebSocket.CLOSING;
    this.mockServer.removeConnection(this);
    
    // Simulate closing delay
    setTimeout(() => {
      this.readyState = WebSocket.CLOSED;
      
      // Dispatch close event
      const closeEvent = new CloseEvent('close', {
        code: code || 1000,
        reason: reason || 'Normal closure',
        wasClean: true
      });
      this.dispatchEvent(closeEvent);
      if (this.onclose) this.onclose.call(this, closeEvent);
      
    }, 50 + Math.random() * 50); // Random delay between 50-100ms
  }

  public send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    if (this.readyState !== WebSocket.OPEN) {
      this.dispatchError('Socket is not open');
      return;
    }
    
    if (typeof data !== 'string') {
      this.dispatchError('Mock WebSocket only supports string data');
      return;
    }
    
    try {
      this.mockServer.handleMessage(this, data);
    } catch (error) {
      this.dispatchError('Error processing message');
      console.error('[MockWebSocket] Error processing message:', error);
    }
  }

  // Event target methods
  public addEventListener<K extends keyof WebSocketEventMap>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  public addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    if (typeof listener === 'function') {
      this.listeners[type].push(listener as EventListener);
    } else {
      this.listeners[type].push((event: Event) => (listener as EventListenerObject).handleEvent(event));
    }
  }

  public removeEventListener<K extends keyof WebSocketEventMap>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  public removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
    if (!this.listeners[type]) return;
    
    const listenerFn = typeof listener === 'function' ? listener : (event: Event) => (listener as EventListenerObject).handleEvent(event);
    this.listeners[type] = this.listeners[type].filter(l => l !== listenerFn);
  }

  public dispatchEvent(event: Event): boolean {
    const type = event.type;
    
    // Call specific handler if exists
    if (type === 'message' && this.onmessage) {
      this.onmessage.call(this, event as MessageEvent);
    } else if (type === 'open' && this.onopen) {
      this.onopen.call(this, event);
    } else if (type === 'close' && this.onclose) {
      this.onclose.call(this, event as CloseEvent);
    } else if (type === 'error' && this.onerror) {
      this.onerror.call(this, event);
    }
    
    // Call all registered listeners
    if (this.listeners[type]) {
      for (const listener of this.listeners[type]) {
        listener.call(this, event);
      }
    }
    
    return !event.defaultPrevented;
  }

  /**
   * Dispatch a message event
   */
  public dispatchMessage(data: string): void {
    if (this.readyState !== WebSocket.OPEN) return;
    
    const messageEvent = new MessageEvent('message', {
      data,
      origin: this.url
    });
    
    this.dispatchEvent(messageEvent);
  }
  
  /**
   * Dispatch an error event
   */
  private dispatchError(message: string): void {
    const errorEvent = new ErrorEvent('error', {
      message,
      error: new Error(message)
    });
    
    this.dispatchEvent(errorEvent);
    if (this.onerror) this.onerror.call(this, errorEvent);
  }
  
  // Static properties from WebSocket interface
  public static readonly CONNECTING: number = 0;
  public static readonly OPEN: number = 1;
  public static readonly CLOSING: number = 2;
  public static readonly CLOSED: number = 3;
  
  // These methods are part of EventTarget but not necessary for our mock
  public CONNECTING: number = WebSocket.CONNECTING;
  public OPEN: number = WebSocket.OPEN;
  public CLOSING: number = WebSocket.CLOSING;
  public CLOSED: number = WebSocket.CLOSED;
  public protocol: string = '';
  public extensions: string = '';
  public bufferedAmount: number = 0;
}
export default MockWebSocketServer;