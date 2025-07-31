// services/documents.ts - Enhanced with better logging
import api from './api'

export interface Document {
  document_id: string
  filename: string
  file_size: number
  status: 'processing' | 'ready' | 'error'
  created_at: string
  url?: string
  active: boolean
}

export const documentService = {
  async uploadDocument(file: File, token?: string): Promise<Document> {
    try {
      console.log('📤 Starting upload for:', file.name, 'Size:', file.size)

      // Convert file to base64
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1] // Remove data:mime;base64, prefix
          resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      console.log('📋 File converted to base64, length:', fileContent.length)

      const response = await api.post('/documents/upload', {
        filename: file.name,
        content: fileContent
      }, token)

      console.log('✅ Upload API response:', response)

      // Validate response structure
      if (!response.document_id) {
        console.error('❌ Invalid upload response - missing document_id:', response)
        throw new Error('Invalid response from server - missing document ID')
      }

      // Ensure the response has all required fields
      const document: Document = {
        document_id: response.document_id,
        filename: response.filename || file.name,
        file_size: response.file_size || file.size,
        status: response.status || 'processing',
        created_at: response.created_at || new Date().toISOString(),
        url: response.url,
        active: response.active !== undefined ? response.active : false
      }

      console.log('📄 Processed document object:', document)
      return document

    } catch (error) {
      console.error('❌ Upload failed:', error)
      throw error
    }
  },

  async getDocuments(token?: string): Promise<Document[]> {
    try {
      console.log('📂 Fetching documents list...')
      const response = await api.get('/documents', token)
      console.log('📋 Documents API response:', response)

      const documents = response.documents || []
      console.log('📄 Processed documents:', documents.length, 'documents')

      return documents
    } catch (error) {
      console.error('❌ Failed to fetch documents:', error)
      throw error
    }
  },

  async deleteDocument(documentId: string, token?: string): Promise<void> {
    try {
      console.log('🗑️ Deleting document:', documentId)
      await api.delete(`/documents/${documentId}`, token)
      console.log('✅ Delete API call successful')
    } catch (error) {
      console.error('❌ Delete failed:', error)
      throw error
    }
  },

  async toggleDocumentActive(documentId: string, isActive: boolean, token?: string): Promise<Document> {
    try {
      console.log('🔄 Toggling document active state:', documentId, 'to', isActive)
      const response = await api.put(`/documents/${documentId}/toggle`, {
        is_active: isActive
      }, token)
      console.log('✅ Toggle API response:', response)
      return response
    } catch (error) {
      console.error('❌ Toggle failed:', error)
      throw error
    }
  },

  // Keep one upload method for compatibility
  async getUploadUrl(_filename: string, _token?: string) {
    throw new Error('Use uploadDocument instead')
  },

  async confirmUpload(_documentId: string, _token?: string) {
    throw new Error('Use uploadDocument instead')
  }
}