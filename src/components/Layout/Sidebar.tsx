//src/components/Layout/Sidebar.tsx
import { Link } from 'react-router-dom'
import { 
  ChatBubbleLeftIcon, 
  DocumentTextIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline'

export const Sidebar = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-ink-muted bg-opacity-75 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-surface transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-[calc(100vh-4rem)]
      `}>
        <div className="flex items-center justify-between p-4 md:hidden">
          <span className="text-xl font-bold">Menu</span>
          <button 
            onClick={onClose}
            className="p-2 rounded-md text-ink-faint hover:text-ink-muted hover:bg-cream-deep"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <Link
            to="/chat"
            className="flex items-center px-4 py-2 text-ink-body hover:bg-cream-deep rounded-md"
            onClick={onClose}
          >
            <ChatBubbleLeftIcon className="h-5 w-5 mr-3" />
            Chat
          </Link>
          <Link
            to="/documents"
            className="flex items-center px-4 py-2 text-ink-body hover:bg-cream-deep rounded-md"
            onClick={onClose}
          >
            <DocumentTextIcon className="h-5 w-5 mr-3" />
            Documents
          </Link>
        </nav>
      </div>
    </>
  )
}