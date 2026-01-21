// WebSocket Service for real-time updates
class WebSocketService {
  constructor() {
    this.ws = null;
    this.subscribers = {
      alerts: [],
      camps: [],
      coordination: [],
      actions: [],
    };
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.isConnecting = false;
  }

  connect(onConnect, onError) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      if (onConnect) onConnect();
      return;
    }

    if (this.isConnecting) {
      console.log('WebSocket connection already in progress');
      return;
    }

    this.isConnecting = true;
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8085/ws';

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        if (onConnect) onConnect();
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.isConnecting = false;
        if (onError) onError(error);
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        this.isConnecting = false;
        this.ws = null;

        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => {
            this.connect(onConnect, onError);
          }, this.reconnectDelay);
        } else {
          console.log('Max reconnection attempts reached');
          if (onError) onError(new Error('WebSocket connection failed'));
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.isConnecting = false;
      if (onError) onError(error);
    }
  }

  handleMessage(message) {
    const { type, data } = message;

    switch (type) {
      case 'ALERT':
        this.notifySubscribers('alerts', data);
        break;
      case 'CAMP_UPDATE':
        this.notifySubscribers('camps', data);
        break;
      case 'COORDINATION':
        this.notifySubscribers('coordination', data);
        break;
      case 'ACTION':
        this.notifySubscribers('actions', data);
        break;
      default:
        console.warn('Unknown message type:', type);
    }
  }

  notifySubscribers(topic, data) {
    if (this.subscribers[topic]) {
      this.subscribers[topic].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${topic} subscriber:`, error);
        }
      });
    }
  }

  subscribeToAlerts(callback) {
    this.subscribers.alerts.push(callback);
    return () => this.unsubscribe('alerts', callback);
  }

  subscribeToCamps(callback) {
    this.subscribers.camps.push(callback);
    return () => this.unsubscribe('camps', callback);
  }

  subscribeToCoordination(callback) {
    this.subscribers.coordination.push(callback);
    return () => this.unsubscribe('coordination', callback);
  }

  subscribeToActions(callback) {
    this.subscribers.actions.push(callback);
    return () => this.unsubscribe('actions', callback);
  }

  unsubscribe(topic, callback) {
    if (this.subscribers[topic]) {
      this.subscribers[topic] = this.subscribers[topic].filter(cb => cb !== callback);
    }
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }

  disconnect() {
    if (this.ws) {
      this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
      this.ws.close();
      this.ws = null;
    }
    // Clear all subscribers
    Object.keys(this.subscribers).forEach(key => {
      this.subscribers[key] = [];
    });
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

const websocketService = new WebSocketService();
export default websocketService;