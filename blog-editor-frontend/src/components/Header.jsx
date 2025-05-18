import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenLine, Bell, UserCircle } from 'lucide-react';

export default function Header({ searchTag, setSearchTag }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef();
  const profileRef = useRef();
  const navigate = useNavigate();

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <header className="w-full border-b border-orange-100 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="bg-gradient-to-r from-orange-500 to-amber-400 p-2 rounded-lg shadow-md">
            <PenLine className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
            Blogger
          </span>
        </Link>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search by tag..."
            value={searchTag || ''}
            onChange={e => setSearchTag(e.target.value)}
            className="border border-orange-200 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 bg-orange-50/50 placeholder:text-orange-300 w-48 transition-all duration-300 focus:w-64"
          />
          <nav className="flex gap-4 items-center">
            <Link 
              to="/create" 
              className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
            >
              Create Blog
            </Link>
            <div className="relative" ref={notifRef}>
              <button 
                className="relative p-2 rounded-full hover:bg-orange-50 transition-colors" 
                onClick={() => setShowNotif(v => !v)}
              >
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              {showNotif && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-orange-100 rounded-lg shadow-lg z-50 p-4 text-sm text-gray-700">
                  No new notifications
                </div>
              )}
            </div>
            <div className="relative" ref={profileRef}>
              <button 
                className="p-1 rounded-full hover:bg-orange-50 transition-colors" 
                onClick={() => setShowProfile(v => !v)}
              >
                <UserCircle className="w-7 h-7 text-gray-600" />
              </button>
              {showProfile && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-orange-100 rounded-lg shadow-lg z-50 py-2">
                  <a href="#" className="block px-4 py-2 hover:bg-orange-50 text-sm text-gray-700 transition-colors">
                    My Profile
                  </a>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 hover:bg-orange-50 text-sm text-gray-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
