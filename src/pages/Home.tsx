import { Link } from 'react-router-dom'
import { Button } from '../components/ui'

export const Home = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Hero */}
      <div className="text-center py-14">
        <h1 className="text-4xl sm:text-5xl font-display font-semibold text-ink mb-5">
          Chat with your documents
        </h1>
        <p className="text-lg text-ink-muted mb-9 max-w-xl mx-auto">
          Upload PDFs, Word files, or notes, then ask questions and get grounded,
          page-cited answers. Retrieval-augmented generation on a serverless AWS stack.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/chat">
            <Button variant="primary" size="lg">
              Start chatting
            </Button>
          </Link>
          <Link to="/documents">
            <Button variant="secondary" size="lg">
              Upload documents
            </Button>
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="border-t border-surface-border pt-10 pb-14">
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <li>
            <p className="font-mono text-xs text-accent-deep mb-2">01</p>
            <h2 className="text-lg font-semibold text-ink mb-2">Upload</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Documents are chunked page-by-page and embedded with Gemini,
              then stored in Pinecone under your account.
            </p>
          </li>
          <li>
            <p className="font-mono text-xs text-accent-deep mb-2">02</p>
            <h2 className="text-lg font-semibold text-ink mb-2">Ask</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Questions retrieve the most relevant passages across every
              active document, with hybrid search and caching.
            </p>
          </li>
          <li>
            <p className="font-mono text-xs text-accent-deep mb-2">03</p>
            <h2 className="text-lg font-semibold text-ink mb-2">Verify</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Every answer cites its sources with page numbers, so you can
              check the model against the original text.
            </p>
          </li>
        </ol>
      </div>
    </div>
  )
}
