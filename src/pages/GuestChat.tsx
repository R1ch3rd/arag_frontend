// pages/GuestChat.tsx — public demo: no account, rate-limited, pre-seeded docs
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface GuestSource {
  filename: string
  pages: number[]
  relevance_score: number
}

interface GuestMessage {
  role: 'user' | 'assistant'
  content: string
  sources?: GuestSource[]
}

const SUGGESTIONS = [
  'What is multi-head attention?',
  'Why did the authors drop recurrence entirely?',
  'How does this RAG system work under the hood?',
]

const API_BASE = import.meta.env.VITE_API_URL || ''

export const GuestChat = () => {
  const [messages, setMessages] = useState<GuestMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const send = async (text: string) => {
    const message = text.trim()
    if (!message || isLoading) return

    setError(null)
    setInput('')
    setMessages((m) => [...m, { role: 'user', content: message }])
    setIsLoading(true)

    try {
      const res = await fetch(`${API_BASE}/guest/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, workspace: 'demo' }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`)
      }

      setMessages((m) => [
        ...m,
        { role: 'assistant', content: data.answer, sources: data.sources },
      ])
    } catch (e: any) {
      const msg = e?.message === 'Failed to fetch'
        ? 'The demo backend was waking up. Ask again, it should answer now.'
        : e?.message || 'Something went wrong. Try again in a moment.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="border-b border-surface-border bg-surface-warm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-accent-btn rounded-lg flex items-center justify-center text-white font-mono text-sm font-semibold">
              aR
            </span>
            <span className="text-xl font-display font-semibold text-ink">aRAG</span>
            <span className="ml-2 text-xs font-mono uppercase tracking-wider bg-sage-dim text-sage px-2 py-1 rounded">
              guest demo
            </span>
          </div>
          <Link
            to="/auth/login"
            className="text-sm text-accent-deep hover:text-accent transition-colors"
          >
            Sign in for your own documents
          </Link>
        </div>
      </header>

      {/* Conversation */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {messages.length === 0 && (
            <div className="text-center py-10">
              <h1 className="text-3xl font-display font-semibold text-ink mb-3">
                Try aRAG without an account
              </h1>
              <p className="text-ink-muted max-w-md mx-auto mb-8">
                This workspace is pre-loaded with the paper
                <span className="text-ink font-medium"> “Attention Is All You Need” </span>
                and this system's architecture notes. Ask anything about them.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-sm border border-surface-border bg-surface rounded-full px-4 py-2 text-ink-muted hover:border-accent hover:text-ink transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex mb-5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  m.role === 'user'
                    ? 'bg-accent-btn text-white'
                    : 'bg-surface border border-surface-border text-ink'
                }`}
              >
                {m.content}
                {m.role === 'assistant' && m.sources && m.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-surface-border">
                    {m.sources.map((s, j) => (
                      <p key={j} className="text-xs font-mono text-ink-faint">
                        {s.filename}
                        {s.pages.length > 0 && ` · p. ${s.pages.join(', ')}`}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start mb-5">
              <div className="bg-surface border border-surface-border rounded-xl px-4 py-3 flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent animate-typing-dot" />
                <span className="w-2 h-2 rounded-full bg-accent animate-typing-dot [animation-delay:0.15s]" />
                <span className="w-2 h-2 rounded-full bg-accent animate-typing-dot [animation-delay:0.3s]" />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-blush-dim border border-blush-dim text-blush text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Composer */}
      <footer className="border-t border-surface-border bg-surface-warm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <form
            onSubmit={(e) => { e.preventDefault(); send(input) }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the seeded documents…"
              maxLength={500}
              className="flex-1 px-4 py-3 bg-surface border border-surface-border rounded-lg text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 bg-accent-btn text-white font-medium rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
          <p className="text-xs text-ink-faint mt-2 text-center">
            Rate-limited public demo, no history is stored.
            <Link to="/auth/signup" className="text-accent-deep hover:text-accent ml-1">
              Create an account
            </Link>{' '}
            to upload your own documents.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default GuestChat
