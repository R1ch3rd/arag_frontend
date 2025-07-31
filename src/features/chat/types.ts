import { Message } from '@/lib/types'

export interface ChatSession {
  id: string
  title: string
  lastMessage?: string
  updatedAt: string
}