import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-surface-warm border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-ink-faint hover:text-ink-muted hover:bg-cream-deep focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent md:hidden"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="flex items-center gap-2">
              <span className="w-8 h-8 bg-accent-btn rounded-lg flex items-center justify-center text-white font-mono text-sm font-semibold">
                aR
              </span>
              <span className="text-xl font-display font-semibold text-ink">aRAG</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-ink-muted hidden sm:inline">
                  {user?.profile?.email || 'User'}
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
