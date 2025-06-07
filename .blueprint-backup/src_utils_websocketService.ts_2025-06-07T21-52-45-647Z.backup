import { v4 as uuidv4 } from 'uuid';

export interface WebSocketMessage {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
}

export interface WebSocketOptions {
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  debug?: boolean;
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onReconnect?: (attempt: number) => void;
}

const DEFAULT_OPTIONS: WebSocketOptions = {
  autoReconnect: true,
  reconnectInterval: 2000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000,
  debug: false,
};

class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private options: WebSocketOptions;
  private reconnectAttempts = 0;
  private reconnectTimeout: number | null = null;
  private heartbeatInterval: number | null = null;
  private messageListeners: Map<string, (message: WebSocketMessage) => void> = new Map();
  private userId?: string;
  private channels: Set<string> = new Set();

  constructor(url: string, options: WebSocketOptions = {}) {
    this.url = url;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Connect to the WebSocket server
   * @param userId Optional user ID for authentication
   */
  public connect(userId?: string): void {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)
    ) {
      this.debugLog('WebSocket is already connected or connecting');
      return;
    }

    this.userId = userId;
    const connectionUrl = userId ? `${this.url}?userId=${userId}` : this.url;

    this.debugLog(`Connecting to WebSocket: ${connectionUrl}`);
    this.socket = new WebSocket(connectionUrl);

    this.socket.onopen = this.handleOpen.bind(this);
    this.socket.onmessage = this.handleMessage.bind(this);
    this.socket.onclose = this.handleClose.bind(this);
    this.socket.onerror = this.handleError.bind(this);
  }

  /**
   * Disconnect from the WebSocket server
   */
  public disconnect(): void {
    this.debugLog('Disconnecting WebSocket');
    this.clearTimers();
    this.reconnectAttempts = 0;

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Send a message to the WebSocket server
   * @param type Message type
   * @param payload Message payload
   */
  public send(type: string, payload: any = {}): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.debugLog('Cannot send message, socket is not open');
      return;
    }

    const message: WebSocketMessage = {
      id: uuidv4(),
      type,
      payload,
      timestamp: Date.now(),
    };

    this.socket.send(JSON.stringify(message));
    this.debugLog(`Message sent: ${message.type}`, message);
  }

  /**
   * Subscribe to a channel
   * @param channel Channel name
   */
  public subscribe(channel: string): void {
    if (this.channels.has(channel)) {
      return;
    }

    this.channels.add(channel);
    this.send('SUBSCRIBE', { channel });
    this.debugLog(`Subscribed to channel: ${channel}`);
  }

  /**
   * Unsubscribe from a channel
   * @param channel Channel name
   */
  public unsubscribe(channel: string): void {
    if (!this.channels.has(channel)) {
      return;
    }

    this.channels.delete(channel);
    this.send('UNSUBSCRIBE', { channel });
    this.debugLog(`Unsubscribed from channel: ${channel}`);
  }

  /**
   * Add a message listener for a specific message type
   * @param type Message type
   * @param callback Callback function
   */
  public on(type: string, callback: (message: WebSocketMessage) => void): () => void {
    const key = `${type}-${uuidv4()}`;
    this.messageListeners.set(key, (message: WebSocketMessage) => {
      if (message.type === type) {
        callback(message);
      }
    });

    // Return unsubscribe function
    return () => {
      this.messageListeners.delete(key);
    };
  }

  /**
   * Check if the WebSocket is connected
   */
  public isConnected(): boolean {
    return !!this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Resubscribe to all channels (after reconnect)
   */
  private resubscribeToChannels(): void {
    this.channels.forEach(channel => {
      this.send('SUBSCRIBE', { channel });
    });
    this.debugLog(`Resubscribed to ${this.channels.size} channels`);
  }

  /**
   * Handle WebSocket open event
   */
  private handleOpen(event: Event): void {
    this.debugLog('WebSocket connected');
    this.reconnectAttempts = 0;

    // Start heartbeat
    this.startHeartbeat();

    // Resubscribe to channels if there are any
    if (this.channels.size > 0) {
      this.resubscribeToChannels();
    }

    // Call onOpen callback if provided
    if (this.options.onOpen) {
      this.options.onOpen();
    }
  }

  /**
   * Handle WebSocket message event
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data) as WebSocketMessage;
      this.debugLog(`Message received: ${message.type}`, message);

      // Handle heartbeat response
      if (message.type === 'PONG') {
        return;
      }

      // Call global message handler if provided
      if (this.options.onMessage) {
        this.options.onMessage(message);
      }

      // Call specific message listeners
      this.messageListeners.forEach(listener => listener(message));
    } catch (error) {
      this.debugLog('Error parsing message', error);
    }
  }

  /**
   * Handle WebSocket close event
   */
  private handleClose(event: CloseEvent): void {
    this.debugLog(`WebSocket disconnected: ${event.code} ${event.reason}`);
    this.clearTimers();

    // Call onClose callback if provided
    if (this.options.onClose) {
      this.options.onClose();
    }

    // Auto-reconnect if enabled
    if (
      this.options.autoReconnect &&
      (!this.options.maxReconnectAttempts ||
        this.reconnectAttempts < this.options.maxReconnectAttempts)
    ) {
      this.attemptReconnect();
    }
  }

  /**
   * Handle WebSocket error event
   */
  private handleError(event: Event): void {
    this.debugLog('WebSocket error', event);

    // Call onError callback if provided
    if (this.options.onError) {
      this.options.onError(event);
    }
  }

  /**
   * Attempt to reconnect to the WebSocket server
   */
  private attemptReconnect(): void {
    this.reconnectAttempts += 1;

    this.debugLog(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.options.maxReconnectAttempts || 'unlimited'})`
    );

    if (this.options.onReconnect) {
      this.options.onReconnect(this.reconnectAttempts);
    }

    this.reconnectTimeout = window.setTimeout(() => {
      this.connect(this.userId);
    }, this.options.reconnectInterval);
  }

  /**
   * Start the heartbeat interval
   */
  private startHeartbeat(): void {
    if (!this.options.heartbeatInterval) return;

    this.clearTimers();

    this.heartbeatInterval = window.setInterval(() => {
      this.send('PING', { timestamp: Date.now() });
    }, this.options.heartbeatInterval);
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Log debug messages if debug is enabled
   */
  private debugLog(message: string, ...data: any[]): void {
    if (this.options.debug) {
      console.log(`[WebSocket] ${message}`, ...data);
    }
  }
}

export default WebSocketService;
