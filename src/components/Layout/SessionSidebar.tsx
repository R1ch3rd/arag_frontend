// components/Layout/SessionSidebar.tsx - Responsive with Proper Scrolling

import { useState } from 'react'
import { Button } from '../ui'
import type { ChatSession } from '../../services/chat'

interface SessionSidebarProps {
  sessions: ChatSession[] // Now receives sessions as props from cache
  currentSessionId?: string
  onSessionSelect: (sessionId: string) => void
  onNewSession: () => void
  onDeleteSession: (sessionId: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export const SessionSidebar = ({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
  isCollapsed,
  onToggleCollapse
}: SessionSidebarProps) => {
  const [deletingSession, setDeletingSession] = useState<string | null>(null)

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent session selection

    if (deletingSession) return // Prevent multiple deletes

    setDeletingSession(sessionId)

    try {
      await onDeleteSession(sessionId)
    } catch (error) {
      console.error('Failed to delete session:', error)
    } finally {
      setDeletingSession(null)
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return time.toLocaleDateString()
  }

  if (isCollapsed) {
    return (
      <div className="w-12 sm:w-16 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
        <div className="p-2 sm:p-4">
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="sm"
            className="w-full p-2"
            title="Expand sidebar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>

        <div className="p-2 sm:p-4">
          <Button
            onClick={onNewSession}
            variant="primary"
            size="sm"
            className="w-full p-2"
            title="New chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 lg:w-72 xl:w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header - fixed height, no shrinking */}
      <div className="flex-shrink-0 p-3 lg:p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3 lg:mb-4">
          <h2 className="text-base lg:text-lg font-semibold text-gray-900">Chat Sessions</h2>
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="sm"
            title="Collapse sidebar"
            className="hidden md:flex"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
        </div>

        <Button
          onClick={onNewSession}
          variant="primary"
          size="sm"
          className="w-full"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </Button>
      </div>

      {/* Sessions List - flex-1 with overflow for independent scrolling */}
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <svg className="w-6 sm:w-8 h-6 sm:h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">No chat sessions yet</p>
            <p className="text-xs text-gray-400 mt-1">Start a new conversation</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sessions.map((session) => (
              <div
                key={session.session_id}
                onClick={() => onSessionSelect(session.session_id)}
                className={`
                  group relative p-3 rounded-lg cursor-pointer transition-colors
                  ${currentSessionId === session.session_id
                    ? 'bg-blue-100 border border-blue-200'
                    : 'hover:bg-gray-100 border border-transparent'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`
                        text-sm lg:text-base font-medium truncate
                        ${currentSessionId === session.session_id
                          ? 'text-blue-900'
                          : 'text-gray-900'
                        }
                      `}>
                        {session.title || 'New Chat'}
                      </h3>

                      {/* Message count badge */}
                      {session.message_count > 0 && (
                        <span className={`
                          text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2
                          ${currentSessionId === session.session_id
                            ? 'bg-blue-200 text-blue-700'
                            : 'bg-gray-200 text-gray-600'
                          }
                        `}>
                          {session.message_count}
                        </span>
                      )}
                    </div>

                    {/* Last message preview */}
                    {session.lastMessage && (
                      <p className={`
                        text-xs truncate mb-1
                        ${currentSessionId === session.session_id
                          ? 'text-blue-700'
                          : 'text-gray-600'
                        }
                      `}>
                        {session.lastMessage}
                      </p>
                    )}

                    {/* Timestamp */}
                    <p className={`
                      text-xs
                      ${currentSessionId === session.session_id
                        ? 'text-blue-600'
                        : 'text-gray-500'
                      }
                    `}>
                      {formatTimeAgo(session.last_message_at || session.last_accessed)}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDeleteSession(session.session_id, e)}
                    disabled={deletingSession === session.session_id}
                    className={`
                      ml-2 p-1 rounded opacity-0 group-hover:opacity-100 flex-shrink-0
                      transition-opacity hover:bg-red-100 text-red-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${currentSessionId === session.session_id ? 'opacity-100' : ''}
                    `}
                    title="Delete session"
                  >
                    {deletingSession === session.session_id ? (
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - fixed height, no shrinking */}
      <div className="flex-shrink-0 p-2 lg:p-3 border-t border-gray-200 bg-gray-25">
        <p className="text-xs text-gray-500 text-center">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}