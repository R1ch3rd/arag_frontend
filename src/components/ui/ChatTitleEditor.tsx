// components/ChatTitleEditor.tsx - Inline title editing

import { useState } from 'react'

interface ChatTitleEditorProps {
  title: string
  onSave: (newTitle: string) => Promise<void>
  className?: string
}

export const ChatTitleEditor = ({ title, onSave, className }: ChatTitleEditorProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(title)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (editValue.trim() === title.trim()) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await onSave(editValue.trim())
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save title:', error)
      setEditValue(title) // Reset on error
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setEditValue(title)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditValue(title)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
          disabled={isSaving}
          className="flex-1 text-xl font-semibold bg-transparent border-b-2 border-blue-500 focus:outline-none disabled:opacity-50"
          maxLength={100}
        />
        {isSaving ? (
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        ) : (
          <div className="flex space-x-1">
            <button
              onClick={handleSave}
              className="p-1 text-green-600 hover:text-green-800"
              title="Save"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-red-600 hover:text-red-800"
              title="Cancel"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <h1 
      className={`text-xl font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors ${className}`}
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      {title || 'New Chat'}
      <svg className="w-4 h-4 inline ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </h1>
  )
}