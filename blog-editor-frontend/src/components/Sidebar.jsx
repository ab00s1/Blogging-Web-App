import { Link, useLocation } from 'react-router-dom';
import { PlusCircle, Home, User } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className="h-full overflow-y-auto border-r border-orange-100 bg-white/80 backdrop-blur p-4 hidden md:block">
      <nav className="flex flex-col gap-3">
        <Link
          to="/dashboard"
          className={`flex items-center gap-2 p-2.5 rounded-lg transition-colors ${
            location.pathname === '/dashboard'
              ? 'bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-700 font-medium'
              : 'hover:bg-orange-50 text-gray-600'
          }`}
        >
          <Home className="w-4 h-4" /> Dashboard
        </Link>
        <Link
          to="/create"
          className={`flex items-center gap-2 p-2.5 rounded-lg transition-colors ${
            location.pathname === '/create'
              ? 'bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-700 font-medium'
              : 'hover:bg-orange-50 text-gray-600'
          }`}
        >
          <PlusCircle className="w-4 h-4" /> Create New Blog
        </Link>
        <Link
          to="/my-blogs"
          className={`flex items-center gap-2 p-2.5 rounded-lg transition-colors ${
            location.pathname === '/my-blogs'
              ? 'bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-700 font-medium'
              : 'hover:bg-orange-50 text-gray-600'
          }`}
        >
          <User className="w-4 h-4" /> My Blogs
        </Link>
      </nav>
    </aside>
  );
}
