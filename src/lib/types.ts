export interface User {
  id: string
  email: string
  name?: string
  profile?: {
    email?: string;
  }
}

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
}

export interface Document {
  document_id: string
  id: string
  title: string
  filename: string
  type: string
  url: string
  status: string
  active: boolean
  created_at: string
  uploadedAt: string
}

export interface UserDocuments {
  document_id: string
  filename: string
  active: boolean
  status: string
  created_at: string
}