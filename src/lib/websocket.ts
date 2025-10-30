import { io, Socket } from 'socket.io-client'

class WebSocketManager {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(url: string = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001') {
    if (this.socket?.connected) {
      return this.socket
    }

    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    })

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
      if (reason === 'io server disconnect') {
        // Server disconnected, manual reconnection needed
        this.reconnect()
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      this.handleReconnect()
    })

    this.socket.on('reconnect_attempt', (attempt) => {
      console.log(`WebSocket reconnection attempt ${attempt}`)
    })

    this.socket.on('reconnect_failed', () => {
      console.error('WebSocket reconnection failed')
    })

    return this.socket
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.socket?.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  private reconnect() {
    if (this.socket) {
      this.socket.connect()
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Message events
  onMessage(callback: (message: any) => void) {
    this.socket?.on('message', callback)
  }

  onMessageUpdate(callback: (update: any) => void) {
    this.socket?.on('message_update', callback)
  }

  onTyping(callback: (data: { user: string; platform: string }) => void) {
    this.socket?.on('typing', callback)
  }

  onPresence(callback: (data: { user: string; status: 'online' | 'offline' }) => void) {
    this.socket?.on('presence', callback)
  }

  // Send events
  sendMessage(message: any) {
    this.socket?.emit('send_message', message)
  }

  startTyping(platform: string) {
    this.socket?.emit('start_typing', { platform })
  }

  stopTyping(platform: string) {
    this.socket?.emit('stop_typing', { platform })
  }

  updatePresence(status: 'online' | 'offline') {
    this.socket?.emit('update_presence', { status })
  }

  // Room management
  joinRoom(roomId: string) {
    this.socket?.emit('join_room', { roomId })
  }

  leaveRoom(roomId: string) {
    this.socket?.emit('leave_room', { roomId })
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected || false
  }

  getSocket(): Socket | null {
    return this.socket
  }
}

// Singleton instance
export const websocketManager = new WebSocketManager()
export default websocketManager