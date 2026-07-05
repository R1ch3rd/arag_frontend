// Enhanced Chat Component - Responsive with Proper Scrolling

import { useState, useEffect, useRef } from 'react'
import { Button } from '../components/ui'
import { Markdown } from '../components/ui/Markdown'
import { chatService } from '../services/chat'
import { cacheManager } from '../services/cacheManager'
import { useAuth } from '../context/AuthContext'
import { SessionSidebar } from '../components/Layout/SessionSidebar'
import { ChatTitleEditor } from '../components/ui/ChatTitleEditor'
import { ModelSelector } from '../components/ui/ModelSelector'

// Local types to match cacheManager
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
  locked_model?: string
}

export const Chat = () => {
  const { getIdToken, cacheInitialized, backgroundLoading } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash') // 🔧 FIX: Default to Gemini instead of Llama
  const [modelLocked, setModelLocked] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check if model should be locked (session has messages)
  const isModelLocked = modelLocked || (currentSession && messages.length > 0)
  const lockReason = isModelLocked ? 'Model is locked after first message in chat' : undefined

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffMinutes < 1) return 'now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Subscribe to cache changes
  useEffect(() => {
    const unsubscribe = cacheManager.subscribe(() => {
      setSessions(cacheManager.getSessions())
      setMessages(cacheManager.getCurrentMessages())
      setCurrentSession(cacheManager.getCurrentSession())
    })

    return () => { unsubscribe() }
  }, [])

  // Initialize chat when cache is ready OR start with empty state
  useEffect(() => {
    if (cacheInitialized && !isInitialized) {
      initializeChatWithCache()
    } else if (!backgroundLoading && !cacheInitialized && !isInitialized) {
      initializeChatWithoutCache()
    }
  }, [cacheInitialized, backgroundLoading, isInitialized])

  // Periodic cleanup of empty sessions (every 10 minutes)
  useEffect(() => {
    const cleanupInterval = setInterval(async () => {
      const token = getIdToken()
      if (token && isInitialized) {
        try {
          const result = await chatService.cleanupEmptySessions(token)
          if (result.deleted > 0) {
            console.log(`🧹 Periodic cleanup: removed ${result.deleted} empty sessions`)
            // Refresh sessions cache if any were deleted
            await cacheManager.refreshSessions(token)
          }
        } catch (error) {
          console.warn('⚠️ Periodic cleanup failed:', error)
        }
      }
    }, 10 * 60 * 1000) // 10 minutes

    return () => clearInterval(cleanupInterval)
  }, [isInitialized, getIdToken])

  const initializeChatWithCache = async () => {
    console.log('🚀 Initializing chat with cached data...')

    try {
      const cachedSessions = cacheManager.getSessions()
      setSessions(cachedSessions)

      // Clean up empty sessions in the background after loading cache
      const token = getIdToken()
      if (token) {
        chatService.cleanupEmptySessions(token)
          .then(result => {
            if (result.deleted > 0) {
              console.log(`🧹 Cleaned up ${result.deleted} empty sessions`)
              // Refresh sessions if any were deleted
              cacheManager.refreshSessions(token)
            }
          })
          .catch(error => console.warn('⚠️ Background cleanup failed:', error))
      }

      const persistedSessionId = localStorage.getItem('chat_current_session_id')
      let targetSession = null

      if (persistedSessionId) {
        targetSession = cachedSessions.find(s => s.session_id === persistedSessionId)
      }

      if (!targetSession && cachedSessions.length > 0) {
        targetSession = cachedSessions[0]
      }

      if (targetSession) {
        await loadSession(targetSession.session_id, false)
      } else {
        await createNewSession()
      }

      setIsInitialized(true)
      console.log('✅ Chat initialized with cache successfully')

    } catch (error) {
      console.error('❌ Chat cache initialization failed:', error)
      await initializeChatWithoutCache()
    }
  }

  const initializeChatWithoutCache = async () => {
    console.log('🚀 Initializing chat without cache (fallback)...')

    try {
      await createNewSession()
      setIsInitialized(true)
      console.log('✅ Chat initialized without cache')
    } catch (error) {
      console.error('❌ Chat initialization failed completely:', error)
      setError('Failed to initialize chat')
      setIsInitialized(true)
    }
  }

  const createNewSession = async () => {
    try {
      const token = getIdToken()
      if (!token) {
        setError('Authentication required')
        return
      }

      // 🔧 FIX: Check for active documents before creating session
      const documents = cacheManager.getDocuments()
      const activeDocuments = documents.filter(doc => doc.active)

      if (activeDocuments.length === 0) {
        setError('You need at least one active document to create a chat session. Please go to Documents and activate a document first.')
        return
      }

      console.log('🆕 Creating new session...')
      setError(null)

      // Clean up empty sessions before creating new one (don't wait for it)
      chatService.cleanupEmptySessions(token)
        .then(result => {
          if (result.deleted > 0) {
            console.log(`🧹 Pre-creation cleanup: removed ${result.deleted} empty sessions`)
            cacheManager.refreshSessions(token)
          }
        })
        .catch(error => console.warn('⚠️ Pre-creation cleanup failed:', error))

      const session = await chatService.createSession(token)

      const sessionWithModel: ChatSession = {
        ...session,
        locked_model: selectedModel
      }

      cacheManager.addSession(sessionWithModel)
      await cacheManager.setCurrentSession(sessionWithModel.session_id, token)

      setCurrentSession(sessionWithModel)
      setMessages([])
      setModelLocked(false)
      setMobileSidebarOpen(false) // Close mobile sidebar after creating session

      localStorage.setItem('chat_current_session_id', sessionWithModel.session_id)

      console.log('✅ New session created:', sessionWithModel.session_id, 'Model:', selectedModel)

    } catch (err: any) {
      // 🔧 FIX: Better error handling for session creation
      console.error('❌ Create session error:', err)

      if (err.message?.includes('document') || err.message?.includes('active')) {
        setError('Session creation failed: You need at least one active document. Please activate a document in the Documents section.')
      } else if (err.status === 400) {
        setError('Session creation failed: Please make sure you have active documents configured.')
      } else {
        setError('Failed to create new session. Please try again.')
      }
    }
  }

  const loadSession = async (sessionId: string, _clearCache: boolean = true) => {
    try {
      if (currentSession?.session_id === sessionId) {
        setMobileSidebarOpen(false) // Close mobile sidebar
        return
      }

      console.log('📂 Loading session:', sessionId)
      setError(null)
      setIsLoading(true)

      const token = getIdToken()
      if (!token) {
        setError('Authentication required')
        return
      }

      const messages = await cacheManager.setCurrentSession(sessionId, token)

      const session = cacheManager.getCurrentSession()
      setCurrentSession(session)
      setMessages(messages)

      if (session) {
        // 🔧 FIX: Always restore locked model from session first
        if (session.locked_model) {
          console.log('🔒 Loading session with locked model:', session.locked_model)
          setSelectedModel(session.locked_model)
          setModelLocked(true)
        } else if (messages.length > 0) {
          // If session has messages but no locked model saved, lock current model
          console.log('🔒 Session has messages, locking current model:', selectedModel)
          setModelLocked(true)
          cacheManager.updateSession(sessionId, { locked_model: selectedModel })
        } else {
          // Empty session, model not locked
          console.log('🔓 Empty session, model not locked')
          setModelLocked(false)
        }

        // 🔧 ADD: Debug logging for model state
        console.log('🔍 Model loading debug:', {
          sessionId,
          sessionLockedModel: session.locked_model,
          selectedModel: selectedModel,
          messagesLength: messages.length,
          modelLocked: session.locked_model ? true : messages.length > 0
        })
      }

      setMobileSidebarOpen(false) // Close mobile sidebar after loading
      localStorage.setItem('chat_current_session_id', sessionId)

      console.log('✅ Session loaded:', sessionId, 'Messages:', messages.length)

    } catch (err) {
      setError('Failed to load session')
      console.error('❌ Load session error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async () => {

    if (!input.trim() || !currentSession) return

    setIsLoading(true)
    setError(null)

    try {
      const token = getIdToken()
      if (!token) {
        setError('Authentication required')
        return
      }

      const messageText = input.trim()
      console.log('💬 Sending message:', messageText, 'Model:', selectedModel)

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content: messageText,
        role: 'user',
        timestamp: new Date().toISOString(),
        sessionId: currentSession.session_id
      }

      setMessages(prev => [...prev, userMessage])
      setInput('')

      cacheManager.addMessage(userMessage)

      if (messages.length === 0) {
        const title = await chatService.generateSessionTitleFromMessage(messageText)
        try {
          await chatService.updateSessionTitle(currentSession.session_id, title, token)
          cacheManager.updateSession(currentSession.session_id, { title })
        } catch (titleError) {
          console.warn('Failed to update session title:', titleError)
        }
      }

      try {
        console.log('🤖 Calling backend with model:', selectedModel)
        const assistantMessage = await chatService.sendMessage(messageText, currentSession.session_id, token, selectedModel)

        console.log('✅ Got assistant response:', assistantMessage.content.substring(0, 100) + '...')

        setMessages(prev => [...prev, assistantMessage])
        cacheManager.addMessage(assistantMessage)

        if (!modelLocked && messages.length === 0) {
          console.log('🔒 Locking model after first message:', selectedModel)
          setModelLocked(true)
          cacheManager.updateSession(currentSession.session_id, { locked_model: selectedModel })
        }

        console.log('✅ Message exchange completed successfully')

      } catch (messageError) {
        console.error('❌ Message sending failed:', messageError)

        const errorMessage: ChatMessage = {
          id: `assistant-error-${Date.now()}`,
          content: 'Sorry, I encountered an error while processing your message. Please try again.',
          role: 'assistant',
          timestamp: new Date().toISOString(),
          sessionId: currentSession.session_id,
          sources: []
        }

        setMessages(prev => [...prev, errorMessage])
        setError('Failed to get response from AI model')
      }

    } catch (err) {
      setError('Failed to send message')
      console.error('❌ Send message error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleModelChange = (newModel: string) => {
    if (isModelLocked) {
      console.warn('🔒 Cannot change model - locked for this chat session')
      setError('Model is locked after first message. Create a new chat to use a different model.')
      setTimeout(() => setError(null), 5000)
      return
    }

    console.log('🔄 Changing model from', selectedModel, 'to', newModel)
    setSelectedModel(newModel)

    if (currentSession && !modelLocked) {
      cacheManager.updateSession(currentSession.session_id, { locked_model: newModel })
    }
  }

  const handleTitleSave = async (newTitle: string) => {
    if (!currentSession) return

    try {
      const token = getIdToken()
      if (!token) throw new Error('Authentication required')

      await chatService.updateSessionTitle(currentSession.session_id, newTitle, token)
      cacheManager.updateSession(currentSession.session_id, { title: newTitle })

      console.log('✅ Title updated:', newTitle)
    } catch (error) {
      console.error('❌ Failed to update title:', error)
      throw error
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading) {
        handleSend()
      }
    }
  }

  const handleNewSession = async () => {
    console.log('🆕 Manual new session requested')
    await createNewSession()
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const token = getIdToken()
      if (!token) return

      console.log('🗑️ Deleting session:', sessionId)
      await chatService.deleteSession(sessionId, token)

      cacheManager.removeSession(sessionId)

      if (currentSession?.session_id === sessionId) {
        await createNewSession()
      }

      console.log('✅ Session deleted successfully:', sessionId)
    } catch (error) {
      console.error('❌ Failed to delete session:', error)
      setError('Failed to delete session')
    }
  }

  // Show loading only briefly, then show app even if cache is loading
  if (!isInitialized && backgroundLoading) {
    return (
      <div className="flex h-screen bg-surface rounded-lg shadow overflow-hidden">
        <div className="w-48 md:w-64 bg-cream border-r border-surface-border flex flex-col items-center justify-center">
          <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full mb-2"></div>
          <p className="text-sm text-ink-muted">Loading sessions...</p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-ink-muted">Setting up your chat...</p>
          </div>
        </div>
      </div>
    )
  }

  const renderMessage = (message: ChatMessage) => (
    <div
      key={message.id}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-3 relative ${message.role === 'user'
            ? 'bg-accent-btn text-white'
            : 'bg-cream text-ink border'
            }`}
        >
          <div className="break-words text-sm leading-relaxed pr-12">
            {message.role === 'assistant'
              ? <Markdown>{message.content}</Markdown>
              : <span className="whitespace-pre-wrap">{message.content}</span>}
          </div>

          {/* Timestamp inside bubble */}
          <div className={`absolute bottom-2 right-3 text-xs opacity-70 ${message.role === 'user' ? 'text-white/70' : 'text-ink-muted'
            }`}>
            {formatTimestamp(message.timestamp)}
          </div>

          {/* Clean sources display */}
          {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-surface-border">
              <p className="text-xs font-medium text-ink-muted mb-2">Sources:</p>
              <div className="space-y-2">
                {message.sources.map((source, idx) => (
                  <div key={idx} className="text-xs text-ink-muted bg-surface rounded-lg p-2 border">
                    <div className="font-medium text-ink mb-1">
                      Document {source.document_id}
                    </div>
                    <div className="line-clamp-2 leading-relaxed">
                      {source.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )


  return (
    <>
      {/* Mobile sidebar overlay - z-index higher than main nav */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-72 sm:w-80 bg-surface shadow-xl h-screen overflow-hidden">
            <SessionSidebar
              sessions={sessions}
              currentSessionId={currentSession?.session_id}
              onSessionSelect={(id) => loadSession(id)}
              onNewSession={handleNewSession}
              onDeleteSession={handleDeleteSession}
              isCollapsed={false}
              onToggleCollapse={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main container - fixed to viewport height, no page scrolling */}
      <div className="flex h-screen bg-surface rounded-lg shadow overflow-hidden">
        {/* Desktop Session Sidebar */}
        <div className="hidden md:block">
          <SessionSidebar
            sessions={sessions}
            currentSessionId={currentSession?.session_id}
            onSessionSelect={(id) => loadSession(id)}
            onNewSession={handleNewSession}
            onDeleteSession={handleDeleteSession}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Main Chat Area - flex column with proper height constraints */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {/* Header - fixed height, no shrinking */}
          <div className="flex-shrink-0 border-b border-surface-border p-3 sm:p-4 bg-surface">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 flex-1">
                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="md:hidden mr-3 p-2 rounded-lg hover:bg-cream-deep transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div className="min-w-0 flex-1">
                  {currentSession ? (
                    <ChatTitleEditor
                      title={currentSession.title || 'New Chat'}
                      onSave={handleTitleSave}
                      className="mb-1"
                    />
                  ) : (
                    <h1 className="text-lg sm:text-xl font-semibold text-ink mb-1">New Chat</h1>
                  )}

                  <div className="flex items-center space-x-3 text-xs sm:text-sm">
                    {currentSession && messages.length > 0 && (
                      <p className="text-ink-muted">
                        {messages.length} message{messages.length !== 1 ? 's' : ''}
                      </p>
                    )}

                    {isModelLocked && (
                      <span className="text-orange-600 font-medium hidden sm:inline">
                        🔒 {selectedModel.split('/').pop()}
                      </span>
                    )}

                    {backgroundLoading && (
                      <div className="flex items-center space-x-2 text-accent-deep">
                        <div className="animate-spin w-3 h-3 border border-accent border-t-transparent rounded-full"></div>
                        <span className="hidden sm:inline">Loading...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3 ml-4">
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={handleModelChange}
                  disabled={isLoading}
                  locked={!!isModelLocked}
                  lockReason={lockReason}
                />
                <Button
                  onClick={handleNewSession}
                  variant="secondary"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline">New Chat</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex-shrink-0 bg-blush-dim text-blush p-3 sm:p-4 text-sm border-b border-blush-dim flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-blush hover:text-blush ml-2 text-lg"
              >
                ×
              </button>
            </div>
          )}

          {/* Messages Area - flex-1 with overflow for scrolling */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6">
            {messages.length === 0 && !isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-ink-muted max-w-md px-4">
                  <svg className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-lg sm:text-xl font-medium text-ink mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-ink-muted leading-relaxed text-sm sm:text-base">
                    Ask questions about your documents and I'll help you find the information you need.
                  </p>
                  {!isModelLocked && (
                    <p className="text-sm text-accent-deep mt-3 font-medium">
                      💡 You can change models before sending your first message
                    </p>
                  )}

                  {/* 🔧 ADD: Warning if no active documents */}
                  {(() => {
                    const documents = cacheManager.getDocuments()
                    const activeDocuments = documents.filter(doc => doc.active)
                    if (documents.length > 0 && activeDocuments.length === 0) {
                      return (
                        <div className="mt-4 p-3 bg-butter-dim border border-butter-dim rounded-lg">
                          <p className="text-sm text-butter">
                            ⚠️ No active documents found.
                            <br />
                            <a href="/documents" className="underline font-medium">
                              Activate documents
                            </a> to start chatting.
                          </p>
                        </div>
                      )
                    }
                    return null
                  })()}
                </div>
              </div>
            )}

            {messages.map(renderMessage)}

            {isLoading && (
              <div className="flex justify-start mb-6">
                <div className="bg-cream rounded-2xl px-4 py-3 border">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-ink-faint rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-ink-faint rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-ink-faint rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-ink-muted">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - fixed height, no shrinking */}
          <div className="flex-shrink-0 border-t border-surface-border p-3 sm:p-4 bg-surface">
            <div className="flex space-x-2 sm:space-x-3">
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask a question about your documents..."
                  className="w-full border border-surface-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none text-sm leading-relaxed"
                  rows={1}
                  disabled={isLoading || !currentSession}
                  style={{
                    minHeight: '48px',
                    maxHeight: '120px',
                    height: 'auto'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = 'auto'
                    target.style.height = Math.min(target.scrollHeight, 120) + 'px'
                  }}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim() || !currentSession}
                variant="primary"
                className="self-end px-4 sm:px-6 py-3 rounded-xl"
              >
                {isLoading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
                <span className="ml-2 hidden sm:inline">Send</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}