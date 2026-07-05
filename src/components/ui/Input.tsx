interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-ink-body">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 bg-surface border rounded-md text-ink placeholder-ink-faint
          focus:outline-none focus:ring-2 focus:ring-accent
          ${error ? 'border-blush' : 'border-surface-border'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-blush">{error}</p>
      )}
    </div>
  )
}
