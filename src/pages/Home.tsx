import { Link } from 'react-router-dom'
import { Button } from '../components/ui'

export const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to RAG System
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your intelligent document management and chat system
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/chat">
                <Button variant="primary" size="lg">
                  Start Chat
                </Button>
              </Link>
              <Link to="/documents">
                <Button variant="secondary" size="lg">
                  Upload Documents
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Document Management */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Document Management
            </h2>
            <p className="text-gray-600">
              Upload and manage your documents with ease
            </p>
          </div>

          {/* Intelligent Chat */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Intelligent Chat
            </h2>
            <p className="text-gray-600">
              Get instant answers from your documents
            </p>
          </div>

          {/* Secure Access */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Secure Access
            </h2>
            <p className="text-gray-600">
              Your data is protected with enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}