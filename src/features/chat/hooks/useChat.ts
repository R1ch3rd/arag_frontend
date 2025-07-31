import { useState, useCallback } from 'react'
import type { Message } from '../../../lib/types'

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true)
    try {
      // API call here
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ content })
      })
      const newMessage = await response.json()
      setMessages(prev => [...prev, newMessage])
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    messages,
    isLoading,
    sendMessage
  }
}