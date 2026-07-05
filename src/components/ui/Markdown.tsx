// src/components/ui/Markdown.tsx
// Chat-bubble markdown renderer. LLM answers arrive as GFM; this styles it
// to match the bubble it lives in without pulling in a typography plugin.
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownProps {
  children: string
  /** invert text colors for use on the orange user bubble */
  inverted?: boolean
}

export const Markdown = ({ children, inverted = false }: MarkdownProps) => {
  const codeBg = inverted ? 'bg-white/20' : 'bg-cream-deep'
  const border = inverted ? 'border-white/30' : 'border-surface-border'

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em>{children}</em>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            {children}
          </a>
        ),
        h1: ({ children }) => <h3 className="font-semibold text-base mt-3 mb-1.5 first:mt-0">{children}</h3>,
        h2: ({ children }) => <h3 className="font-semibold text-base mt-3 mb-1.5 first:mt-0">{children}</h3>,
        h3: ({ children }) => <h4 className="font-semibold mt-3 mb-1.5 first:mt-0">{children}</h4>,
        h4: ({ children }) => <h4 className="font-semibold mt-2 mb-1 first:mt-0">{children}</h4>,
        ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        code: ({ className, children }) => {
          const isBlock = /language-/.test(className || '')
          return isBlock ? (
            <code className={`block ${codeBg} rounded-md p-3 my-2 font-mono text-xs overflow-x-auto whitespace-pre`}>
              {children}
            </code>
          ) : (
            <code className={`${codeBg} rounded px-1.5 py-0.5 font-mono text-xs`}>
              {children}
            </code>
          )
        },
        pre: ({ children }) => <pre className="my-0">{children}</pre>,
        blockquote: ({ children }) => (
          <blockquote className={`border-l-2 ${border} pl-3 my-2 opacity-90`}>{children}</blockquote>
        ),
        hr: () => <hr className={`my-3 border-t ${border}`} />,
        table: ({ children }) => (
          <div className="overflow-x-auto my-2">
            <table className={`text-xs border ${border} border-collapse`}>{children}</table>
          </div>
        ),
        th: ({ children }) => <th className={`border ${border} px-2 py-1 font-semibold text-left`}>{children}</th>,
        td: ({ children }) => <td className={`border ${border} px-2 py-1`}>{children}</td>,
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
