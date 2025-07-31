// Updated chat.ts with better error handling and cleanup

import api from './api'

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  sessionId?: string
  sources?: Array<{
    document_id: string
    text: string
    relevance_score: number
  }>
}

export interface ChatSession {
  id: string
  session_id: string
  title?: string
  created_at: string
  last_accessed: string
  last_message_at?: string
  message_count: number
  document_set: string[]
  lastMessage?: string
  isEmpty?: boolean
}

const CURRENT_SESSION_KEY = 'chat_current_session_id'

export const chatService = {
  // Session Management
  async createSession(token: string, documentIds?: string[]): Promise<ChatSession> {
    try {
      const response = await api.post('/chat/sessions', {
        document_ids: documentIds
      }, token)

      // Only create the session object if the API call succeeds
      const session = {
        id: response.session_id,
        session_id: response.session_id,
        title: response.title || 'New Chat',
        created_at: response.created_at || new Date().toISOString(),
        last_accessed: response.last_accessed || new Date().toISOString(),
        last_message_at: response.last_message_at,
        message_count: response.message_count || 0,
        document_set: response.document_set || response.document_ids || [],
        lastMessage: response.last_message || '',
        isEmpty: (response.message_count || 0) === 0
      }

      this.setCurrentSessionId(session.session_id)
      return session
    } catch (error) {
      console.error('Failed to create session:', error)
      throw error // Re-throw the error instead of creating a fake session
    }
  },

  async listSessions(token: string): Promise<ChatSession[]> {
    const response = await api.get('/chat/sessions', token)

    const sessions = (response.sessions || []).map((session: any) => ({
      id: session.session_id,
      session_id: session.session_id,
      title: session.title || this.generateSessionTitle(session),
      created_at: session.created_at,
      last_accessed: session.last_accessed,
      last_message_at: session.last_message_at || session.last_accessed,
      message_count: session.message_count || 0,
      document_set: session.document_set || [],
      lastMessage: session.last_message || '',
      isEmpty: (session.message_count || 0) === 0
    }))

    // Sort by last message time (most recent first)
    return sessions.sort((a: any, b: any) => {
      const timeA = new Date(a.last_message_at || a.last_accessed).getTime()
      const timeB = new Date(b.last_message_at || b.last_accessed).getTime()
      return timeB - timeA
    })
  },

  async deleteSession(sessionId: string, token: string): Promise<void> {
    await api.delete(`/chat/sessions/${sessionId}`, token)

    if (this.getCurrentSessionId() === sessionId) {
      this.clearCurrentSessionId()
    }
  },

  async deleteEmptySession(sessionId: string, token: string): Promise<boolean> {
    try {
      await api.delete(`/chat/sessions/${sessionId}?force_empty=true`, token)

      if (this.getCurrentSessionId() === sessionId) {
        this.clearCurrentSessionId()
      }

      console.log(`Successfully deleted empty session: ${sessionId}`)
      return true
    } catch (error) {
      console.warn('Failed to delete empty session:', sessionId, error)
      return false
    }
  },

  // Enhanced cleanup with better error handling
  async cleanupEmptySessions(token: string): Promise<{ deleted: number; failed: number }> {
    try {
      const sessions = await this.listSessions(token)
      const emptySessions = sessions.filter(session =>
        session.isEmpty && session.message_count === 0
      )

      if (emptySessions.length === 0) {
        console.log('No empty sessions to clean up')
        return { deleted: 0, failed: 0 }
      }

      console.log(`Found ${emptySessions.length} empty sessions to clean up`)

      let deleted = 0
      let failed = 0

      // Delete empty sessions one by one to track success/failure
      for (const session of emptySessions) {
        const success = await this.deleteEmptySession(session.session_id, token)
        if (success) {
          deleted++
        } else {
          failed++
        }

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      console.log(`Empty session cleanup completed: ${deleted} deleted, ${failed} failed`)
      return { deleted, failed }
    } catch (error) {
      console.error('Failed to cleanup empty sessions:', error)
      return { deleted: 0, failed: 0 }
    }
  },

  async updateSessionTitle(sessionId: string, title: string, token: string): Promise<void> {
    await api.put(`/chat/sessions/${sessionId}`, { title }, token)
  },

  async updateSessionLastMessage(sessionId: string, message: string, token: string): Promise<void> {
    try {
      await api.put(`/chat/sessions/${sessionId}`, {
        last_message: message,
        last_message_at: new Date().toISOString()
      }, token)
    } catch (error) {
      console.warn('Failed to update session last message:', error)
    }
  },

  // Message Operations
  async sendMessage(message: string, sessionId: string, token: string, model?: string): Promise<ChatMessage> {
    console.log('📤 Sending message:', { message, sessionId, model })

    try {
      const response = await api.post(`/chat/sessions/${sessionId}/messages`, {
        message: message,
        model: model || 'together-meta-llama/Llama-3.3-70B-Instruct-Turbo-Free' // Default model
      }, token)

      console.log('📥 Backend response:', response)

      // ✅ Check if response has the expected structure
      if (!response.response) {
        console.error('❌ Invalid response structure:', response)
        throw new Error('Invalid response from backend')
      }

      // ✅ Create assistant message from response
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        content: response.response,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
        sources: response.sources || []
      }

      console.log('✅ Created assistant message:', assistantMessage)

      // Update session's last message (don't await - do in background)
      this.updateSessionLastMessage(sessionId, message, token).catch(error => {
        console.warn('⚠️ Failed to update session last message:', error)
      })

      return assistantMessage

    } catch (error) {
      console.error('❌ SendMessage error:', error)

      // Return error message as assistant response
      return {
        id: `assistant-error-${Date.now()}`,
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
        sources: []
      }
    }
  },
  async getMessages(sessionId: string, token: string): Promise<ChatMessage[]> {
    const response = await api.get(`/chat/sessions/${sessionId}/messages`, token)

    return (response.messages || []).map((msg: any) => ({
      id: msg.id || msg.SK || `${msg.role}-${msg.timestamp}`,
      content: msg.content,
      role: msg.role,
      timestamp: msg.timestamp,
      sessionId: sessionId,
      sources: msg.sources || []
    }))
  },

  // Session Persistence
  setCurrentSessionId(sessionId: string): void {
    try {
      localStorage.setItem(CURRENT_SESSION_KEY, sessionId)
    } catch (error) {
      console.warn('Failed to persist current session:', error)
    }
  },

  getCurrentSessionId(): string | null {
    try {
      return localStorage.getItem(CURRENT_SESSION_KEY)
    } catch (error) {
      console.warn('Failed to get persisted session:', error)
      return null
    }
  },

  clearCurrentSessionId(): void {
    try {
      localStorage.removeItem(CURRENT_SESSION_KEY)
    } catch (error) {
      console.warn('Failed to clear persisted session:', error)
    }
  },

  // Cache Management - DISABLE FOR NOW
  async clearCache(_token: string): Promise<void> {
    // TEMPORARILY DISABLED DUE TO 403 ERROR
    console.warn('Cache clearing disabled due to 403 authentication error')
    return Promise.resolve()

    /* Original code - enable when 403 is fixed:
    try {
      await api.post('/cache/clear', {}, token)
      console.log('Cache cleared successfully')
    } catch (error) {
      console.warn('Failed to clear cache:', error)
      throw error // Re-throw to let caller handle
    }
    */
  },

  // Auto-generate titles
  async generateSessionTitleFromMessage(message: string): Promise<string> {
    const firstSentence = message.split(/[.!?]/)[0].trim()
    if (firstSentence.length > 0 && firstSentence.length <= 50) {
      return firstSentence
    }
    return message.length > 50 ? message.substring(0, 47) + '...' : message
  },

  // Utility Methods
  generateSessionTitle(session: any): string {
    if (session.message_count > 0) {
      return `Chat ${new Date(session.created_at).toLocaleDateString()}`
    }
    return 'New Chat'
  },

  async getSessionWithMessages(sessionId: string, token: string): Promise<{
    session: ChatSession | null,
    messages: ChatMessage[]
  }> {
    try {
      const [sessions, messages] = await Promise.all([
        this.listSessions(token),
        this.getMessages(sessionId, token)
      ])

      const session = sessions.find(s => s.session_id === sessionId) || null
      return { session, messages }
    } catch (error) {
      console.error('Error getting session with messages:', error)
      return { session: null, messages: [] }
    }
  },

  async restorePersistedSession(token: string): Promise<{
    session: ChatSession | null,
    messages: ChatMessage[]
  }> {
    const persistedSessionId = this.getCurrentSessionId()

    if (!persistedSessionId) {
      return { session: null, messages: [] }
    }

    try {
      console.log('Restoring persisted session:', persistedSessionId)
      const result = await this.getSessionWithMessages(persistedSessionId, token)

      if (!result.session) {
        console.log('Persisted session not found, clearing persistence')
        this.clearCurrentSessionId()
        return { session: null, messages: [] }
      }

      return result
    } catch (error) {
      console.warn('Failed to restore persisted session:', error)
      this.clearCurrentSessionId()
      return { session: null, messages: [] }
    }
  }
}