import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PenLine, Menu, X } from "lucide-react";
import { useState } from "react";

const Logo = () => (
  <div className="flex items-center gap-2 font-bold text-xl">
    <div className="bg-gradient-to-r from-orange-500 to-amber-400 p-2 rounded-lg">
      <PenLine className="h-5 w-5 text-white" aria-hidden="true" />
    </div>
    <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Blogger</span>
  </div>
);

export default function EnhancedLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="sticky top-0 w-full border-b border-orange-100 bg-white/90 backdrop-blur-md shadow-sm z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
          <Logo />
          <div className="hidden md:flex gap-4 items-center">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">Log in</Link>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white shadow-md hover:shadow-lg transition-all" asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
              >
                Logout
              </Button>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-orange-600 hover:bg-orange-50" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-4 py-3 border-t border-orange-100 bg-white/95 shadow-md">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="block py-3 text-gray-700 hover:text-orange-600 transition-colors">Log in</Link>
                <Link to="/signup" className="block py-3 mt-2 text-white text-center bg-gradient-to-r from-orange-500 to-amber-400 rounded-md shadow-sm hover:shadow-md transition-all">Sign up</Link>
              </>
            ) : (
              <Button 
                variant="outline" 
                className="w-full border-orange-200 text-orange-700 hover:bg-orange-50" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-8 px-4">
            <div className="inline-block animate-bounce-slow mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-amber-400 p-4 rounded-full shadow-lg">
                <PenLine className="h-8 w-8 text-white" aria-hidden="true" />
              </div>
            </div>
            <h1 className="text-4xl font-bold md:text-6xl tracking-tight">
              Welcome to <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Blogger</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Start writing, sharing, and growing your audience with our modern blogging platform designed for creators like you.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white text-lg py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all w-full md:w-auto" 
                asChild
              >
                <Link to="/dashboard">Get Started</Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-orange-200 text-orange-700 hover:bg-orange-50 py-6 px-8 rounded-xl w-full md:w-auto" 
                asChild
              >
                <Link to="#">Explore Blogs</Link>
              </Button>
            </div>
          </div>
          
          {/* Features Preview */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-orange-100">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <PenLine className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Easy Writing</h3>
              <p className="text-gray-600">Intuitive editor with rich formatting options to create beautiful content.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-orange-100">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure Platform</h3>
              <p className="text-gray-600">Your content is protected with enterprise-grade security.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-orange-100">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Grow Audience</h3>
              <p className="text-gray-600">Built-in tools to help you reach and engage with more readers.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-orange-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="text-orange-500 hover:text-orange-600">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-orange-500 hover:text-orange-600">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} Blogger. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}