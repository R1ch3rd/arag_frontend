// src/components/layout/Navbar.tsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui';

export const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              RAG System
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-600">
                  {user?.profile?.email || user?.email || 'User'}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};