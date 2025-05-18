import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useState } from 'react';

export default function MainLayout() {
  const [searchTag, setSearchTag] = useState('');
  return (
    <div className="relative min-h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header searchTag={searchTag} setSearchTag={setSearchTag} />
      </div>

      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-16 bottom-16 w-48 z-40">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="ml-48 pt-16 pb-16">
        <main className="h-[calc(100vh-8rem)] overflow-y-auto">
          <Outlet context={{ searchTag, setSearchTag }} />
        </main>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Footer />
      </div>
    </div>
  );
}
