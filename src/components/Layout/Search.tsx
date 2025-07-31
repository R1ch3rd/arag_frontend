// components/SessionSearch.tsx
import { useState } from 'react'
import { chatService, type ChatSession } from '../../services/chat'
import { useAuth } from '../../context/AuthContext'

interface SessionSearchProps {
  onSessionSelect: (sessionId: string) => void
  isOpen: boolean
  onClose: () => void
}

export const SessionSearch = ({ onSessionSelect, isOpen, onClose }: SessionSearchProps) => {
  const { getIdToken } = useAuth()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ChatSession[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    try {
      const token = getIdToken()
      if (!token) return

      const searchResults = await chatService.searchSessions(searchQuery, token)
      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(value)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  const handleSessionClick = (sessionId: string) => {
    onSessionSelect(sessionId)
    onClose()
    setQuery('')
    setResults([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Search Chat Sessions</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search by session title or message content..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Searching...
            </div>
          ) : query && results.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>No sessions found for "{query}"</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((session) => (
                <div
                  key={session.session_id}
                  onClick={() => handleSessionClick(session.session_id)}
                  className="p-4 hover:bg-gray-50 cursor-pointer rounded-lg border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {session.title || 'Untitled Chat'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(session.last_accessed).toLocaleDateString()} • {session.message_count} messages
                      </p>
                      {session.lastMessage && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {session.lastMessage}
                        </p>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-gray-400 ml-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>Start typing to search your chat sessions</p>
              <p className="text-sm mt-1">Search by title or message content</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  )
}