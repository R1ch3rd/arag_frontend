// services/cacheManager.ts - Centralized cache management with cleanup

// Define types locally to avoid import issues
interface ChatMessage {
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

interface ChatSession {
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
  locked_model?: string  // New: stores the locked model for this session
}

interface UserDocuments {
  id: string
  filename: string
  active: boolean
  upload_date: string
  file_size: number
  chunk_count: number
}

interface CacheState {
  sessions: ChatSession[]
  documents: UserDocuments[]
  currentSessionId: string | null
  currentMessages: ChatMessage[]
  lastFetch: {
    sessions: number
    documents: number
    messages: number
  }
  isInitialized: boolean
}

class CacheManager {
  private cache: CacheState = {
    sessions: [],
    documents: [],
    currentSessionId: null,
    currentMessages: [],
    lastFetch: {
      sessions: 0,
      documents: 0,
      messages: 0
    },
    isInitialized: false
  }

  private subscribers: Set<() => void> = new Set()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  // Subscribe to cache changes
  subscribe(callback: () => void) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  private notify() {
    this.subscribers.forEach(callback => callback())
  }

  // Initialize cache on login
  async initializeCache(token: string): Promise<void> {
    console.log('🚀 Initializing cache...')

    try {
      // Fetch both sessions and documents in parallel
      const [sessionsResponse, documentsResponse] = await Promise.all([
        fetch('/api/chat/sessions', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/documents', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (sessionsResponse.ok && documentsResponse.ok) {
        const sessionsData = await sessionsResponse.json()
        const documentsData = await documentsResponse.json()

        this.cache.sessions = sessionsData.sessions || []
        this.cache.documents = documentsData.documents || []
        this.cache.lastFetch.sessions = Date.now()
        this.cache.lastFetch.documents = Date.now()
        this.cache.isInitialized = true

        console.log('✅ Cache initialized:', {
          sessions: this.cache.sessions.length,
          documents: this.cache.documents.length
        })

        this.notify()
      }
    } catch (error) {
      console.error('❌ Cache initialization failed:', error)
    }
  }

  // Get sessions from cache
  getSessions(): ChatSession[] {
    return this.cache.sessions
  }

  // Get documents from cache
  getDocuments(): UserDocuments[] {
    return this.cache.documents
  }

  // Get current session
  getCurrentSession(): ChatSession | null {
    if (!this.cache.currentSessionId) return null
    return this.cache.sessions.find(s => s.session_id === this.cache.currentSessionId) || null
  }

  // Get current messages
  getCurrentMessages(): ChatMessage[] {
    return this.cache.currentMessages
  }

  // Set current session and load its messages
  async setCurrentSession(sessionId: string, token: string): Promise<ChatMessage[]> {
    if (this.cache.currentSessionId === sessionId) {
      // Same session, return cached messages
      return this.cache.currentMessages
    }

    console.log('🔄 Switching to session:', sessionId)

    try {
      // Load messages for new session (no cache clearing)
      const response = await fetch(`/api/chat/sessions/${sessionId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        this.cache.currentSessionId = sessionId
        this.cache.currentMessages = data.messages || []
        this.cache.lastFetch.messages = Date.now()

        this.notify()
        return this.cache.currentMessages
      }
    } catch (error) {
      console.error('❌ Failed to set current session:', error)
    }

    return []
  }

  // Add new session to cache
  addSession(session: ChatSession): void {
    this.cache.sessions.unshift(session) // Add to beginning
    this.notify()
  }

  // Update session in cache
  updateSession(sessionId: string, updates: Partial<ChatSession>): void {
    const index = this.cache.sessions.findIndex(s => s.session_id === sessionId)
    if (index !== -1) {
      this.cache.sessions[index] = { ...this.cache.sessions[index], ...updates }
      this.notify()
    }
  }

  // Remove session from cache
  removeSession(sessionId: string): void {
    this.cache.sessions = this.cache.sessions.filter(s => s.session_id !== sessionId)
    if (this.cache.currentSessionId === sessionId) {
      this.cache.currentSessionId = null
      this.cache.currentMessages = []
    }
    this.notify()
  }

  // Remove multiple sessions from cache (for bulk cleanup)
  removeSessions(sessionIds: string[]): void {
    this.cache.sessions = this.cache.sessions.filter(s => !sessionIds.includes(s.session_id))
    if (this.cache.currentSessionId && sessionIds.includes(this.cache.currentSessionId)) {
      this.cache.currentSessionId = null
      this.cache.currentMessages = []
    }
    this.notify()
  }

  // Add message to current session
  addMessage(message: ChatMessage): void {
    if (this.cache.currentSessionId === message.sessionId) {
      this.cache.currentMessages.push(message)

      // Update session's last message info
      this.updateSession(message.sessionId!, {
        lastMessage: message.content.substring(0, 100),
        last_message_at: message.timestamp,
        message_count: this.cache.currentMessages.length
      })

      this.notify()
    }
  }

  // Force refresh documents (only when needed)
  async refreshDocuments(token: string): Promise<void> {
    try {
      console.log('🔄 Fetching documents from server...')
      const response = await fetch('/api/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        const newDocuments = data.documents || []

        console.log('📋 Server returned documents:', newDocuments.length)

        this.cache.documents = newDocuments
        this.cache.lastFetch.documents = Date.now()
        this.notify()

        interface DocumentLogInfo {
          id: string
          filename: string
          active: boolean
        }

        const logDocuments: DocumentLogInfo[] = newDocuments.map((d: { document_id: string; filename: string; active: boolean }) => ({
          id: d.document_id,
          filename: d.filename,
          active: d.active
        }))

        console.log('✅ Documents cache updated:', {
          count: newDocuments.length,
          documents: logDocuments
        })
      } else {
        console.error('❌ Failed to refresh documents - HTTP', response.status)
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Failed to refresh documents:', error)
      throw error // Re-throw so caller can handle it
    }
  }

  // Force refresh sessions (only when needed)
  async refreshSessions(token: string): Promise<void> {
    try {
      const response = await fetch('/api/chat/sessions', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        this.cache.sessions = data.sessions || []
        this.cache.lastFetch.sessions = Date.now()
        this.notify()
        console.log('🔄 Sessions refreshed from server')
      }
    } catch (error) {
      console.error('❌ Failed to refresh sessions:', error)
    }
  }

  // Get empty sessions that can be cleaned up
  getEmptySessions(): ChatSession[] {
    return this.cache.sessions.filter(session =>
      session.message_count === 0 || session.isEmpty
    )
  }

  // Clean up empty sessions from cache (call this after successful backend cleanup)
  cleanupEmptySessionsFromCache(): string[] {
    const emptySessions = this.getEmptySessions()
    const emptySessionIds = emptySessions.map(s => s.session_id)

    if (emptySessionIds.length > 0) {
      this.removeSessions(emptySessionIds)
      console.log(`🧹 Removed ${emptySessionIds.length} empty sessions from cache`)
    }

    return emptySessionIds
  }

  // Integrated cleanup that calls backend and updates cache
  async cleanupEmptySessions(token: string): Promise<{ deleted: number; failed: number }> {
    try {
      // Import chatService dynamically to avoid circular dependency
      const { chatService } = await import('./chat')

      const result = await chatService.cleanupEmptySessions(token)

      if (result.deleted > 0) {
        // Clean up the cache as well
        this.cleanupEmptySessionsFromCache()

        // Refresh sessions to ensure cache is in sync
        await this.refreshSessions(token)
      }

      return result
    } catch (error) {
      console.error('❌ Failed to cleanup empty sessions:', error)
      return { deleted: 0, failed: 0 }
    }
  }

  // Check if cache needs refresh
  needsRefresh(type: 'sessions' | 'documents' | 'messages'): boolean {
    const lastFetch = this.cache.lastFetch[type]
    return Date.now() - lastFetch > this.CACHE_TTL
  }

  // Clear all cache (on logout)
  clearAll(): void {
    this.cache = {
      sessions: [],
      documents: [],
      currentSessionId: null,
      currentMessages: [],
      lastFetch: { sessions: 0, documents: 0, messages: 0 },
      isInitialized: false
    }
    this.notify()
  }

  // Get cache status
  getStatus() {
    return {
      isInitialized: this.cache.isInitialized,
      sessionCount: this.cache.sessions.length,
      documentCount: this.cache.documents.length,
      currentSession: this.cache.currentSessionId,
      messageCount: this.cache.currentMessages.length,
      emptySessionCount: this.getEmptySessions().length
    }
  }
}

export const cacheManager = new CacheManager()