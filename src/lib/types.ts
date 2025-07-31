export interface User {
    id: string
    email: string
    name?: string
  }
  
  export interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
    timestamp: string
  }
  
  export interface Document {
    id: string
    title: string
    type: string
    url: string
    uploadedAt: string
  }