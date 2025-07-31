import { useState, useEffect } from 'react'
import { Button, Card } from '../components/ui'
import { documentService } from '../services/documents'
import { useAuth } from '../context/AuthContext'
import { cacheManager } from '../services/cacheManager'
import type { UserDocuments } from '../lib/types'

export const Documents = () => {
  const [documents, setDocuments] = useState<UserDocuments[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())
  const { token, cacheInitialized } = useAuth()

  // 🔧 FIX: Always wait for cache, never fetch directly
  useEffect(() => {
    if (cacheInitialized) {
      // Use cached documents - this is the ONLY source of documents
      const cachedDocuments = cacheManager.getDocuments()
      console.log('📋 Using cached documents:', cachedDocuments.length)
      // Simple assignment without type checking for now
      setDocuments(cachedDocuments as any)
    }
  }, [cacheInitialized])

  // 🔧 Subscribe to cache changes to keep documents in sync
  useEffect(() => {
    if (cacheInitialized) {
      console.log('📡 Subscribing to cache changes...')
      const unsubscribe = cacheManager.subscribe(() => {
        const cachedDocuments = cacheManager.getDocuments()
        console.log('🔔 Cache notification received - documents count:', cachedDocuments.length)
        // Simplified logging without accessing document_id directly
        console.log('📋 Updated documents count:', cachedDocuments.length)
        setDocuments(cachedDocuments as any)
      })
      return () => {
        console.log('📡 Unsubscribing from cache changes')
        unsubscribe()
      }
    }
  }, [cacheInitialized])

  // 🔧 Removed loadDocuments function since we now only use cache

  const handleFiles = async (files: File[]) => {
    if (!token) {
      setError('No authentication token available')
      return
    }

    setIsLoading(true)
    setError(null)

    for (const file of files) {
      try {
        console.log('📤 Uploading file:', file.name)
        const document = await documentService.uploadDocument(file, token)
        console.log('✅ Upload successful:', document)

        // 🔧 Simplified upload success handling
        console.log('✅ Upload successful:', document)

        // 🔧 Simple cache refresh without complex retry logic
        if (cacheInitialized) {
          console.log('🔄 Refreshing cache after upload...')
          await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
          await cacheManager.refreshDocuments(token)
          console.log('✅ Cache refresh completed')
        }

      } catch (err: any) {
        console.error('❌ Upload error:', err)
        setError(`Failed to upload ${file.name}: ${err.message || 'Unknown error'}`)
      }
    }

    setIsLoading(false)
  }

  const handleDelete = async (documentId: string) => {
    if (!token) {
      setError('No authentication token available')
      return
    }

    // Add confirmation dialog
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return
    }

    setDeletingIds(prev => new Set(prev).add(documentId))
    setError(null)

    try {
      console.log('🗑️ Deleting document:', documentId)
      await documentService.deleteDocument(documentId, token)
      console.log('✅ Delete successful')

      // Refresh cache instead of updating local state directly
      if (cacheInitialized) {
        console.log('🔄 Refreshing cache after delete...')
        await cacheManager.refreshDocuments(token)
        console.log('✅ Cache refresh completed')
      }

    } catch (err: any) {
      console.error('❌ Delete error:', err)
      setError(`Failed to delete document: ${err.message || 'Unknown error'}`)
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(documentId)
        return newSet
      })
    }
  }

  const handleToggleActive = async (documentId: string, currentActive: boolean) => {
    if (!token) {
      setError('No authentication token available')
      return
    }

    setTogglingIds(prev => new Set(prev).add(documentId))
    setError(null)

    try {
      console.log('🔄 Toggling document active state:', documentId, 'to', !currentActive)
      await documentService.toggleDocumentActive(documentId, !currentActive, token)
      console.log('✅ Toggle successful')

      // Refresh cache instead of updating local state directly
      if (cacheInitialized) {
        console.log('🔄 Refreshing cache after toggle...')
        await cacheManager.refreshDocuments(token)
        console.log('✅ Cache refresh completed')
      }

    } catch (err: any) {
      console.error('❌ Toggle error:', err)
      setError(`Failed to toggle document status: ${err.message || 'Unknown error'}`)
    } finally {
      setTogglingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(documentId)
        return newSet
      })
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  // const formatFileSize = (bytes: number) => {
  //   if (bytes === 0) return '0 Bytes'
  //   const k = 1024
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB']
  //   const i = Math.floor(Math.log(bytes) / Math.log(k))
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  // }

  // Show loading state while cache is initializing
  if (!cacheInitialized) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your documents...</p>
        </div>
      </div>
    )
  }

  // Show loading state while token is being retrieved
  if (!token) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-8">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // 🔧 Get count of active documents for better UX
  const activeDocuments = documents.filter(doc => doc.active)
  const hasActiveDocuments = activeDocuments.length > 0

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-600">
          Upload and manage your documents
          {documents.length > 0 && (
            <span className="ml-2">
              • {activeDocuments.length} of {documents.length} active
            </span>
          )}
        </p>
      </div>

      {/* 🔧 DEBUG: Add cache status for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-100 rounded-md text-xs">
          <strong>Debug Info:</strong> Cache initialized: {cacheInitialized ? '✅' : '❌'},
          Documents in state: {documents.length},
          Documents in cache: {cacheManager.getDocuments().length}
        </div>
      )}

      {/* 🔧 Add warning if no active documents */}
      {documents.length > 0 && !hasActiveDocuments && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">No Active Documents</h3>
              <p className="mt-1 text-sm text-yellow-700">
                You need at least one active document to create chat sessions.
                Click "Activate" on any document to use it in your chats.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Upload Area */}
      <Card
        className={`p-8 border-2 border-dashed ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className="text-gray-600 mb-4">
            Drag and drop your files here, or
          </div>
          <Button
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.multiple = true
              input.onchange = (e) => {
                const files = Array.from((e.target as HTMLInputElement).files || [])
                handleFiles(files)
              }
              input.click()
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Uploading...' : 'Browse Files'}
          </Button>
        </div>
      </Card>

      {/* Documents List */}
      <div className="mt-8 space-y-4">
        {documents && documents.length > 0 ? (
          documents.map((doc, index) => (
            <Card key={doc.document_id || `doc-${index}`} className={`p-4 ${!doc.active ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{doc.filename}</h3>
                      {!doc.active && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Inactive
                        </span>
                      )}
                      {doc.active && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Uploaded {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.status === 'processing' ? (
                    <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-sm">
                      Processing...
                    </span>
                  ) : doc.status === 'ready' ? (
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
                      Ready
                    </span>
                  ) : (
                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-sm">
                      Error
                    </span>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(doc.document_id, doc.active)}
                    disabled={togglingIds.has(doc.document_id)}
                  >
                    {togglingIds.has(doc.document_id)
                      ? 'Updating...'
                      : doc.active
                        ? 'Deactivate'
                        : 'Activate'
                    }
                  </Button>

                  <Button variant="ghost" size="sm">
                    View
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(doc.document_id)}
                    disabled={deletingIds.has(doc.document_id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    {deletingIds.has(doc.document_id) ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No documents uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  )
}