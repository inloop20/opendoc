import { FileIcon, MagnifyingGlassIcon, GearIcon, SignOutIcon } from '@phosphor-icons/react';
import { useContext } from 'react';
import { useState } from 'react';
import React from 'react';
import { AuthContext } from '../../auth/context/AuthContext';

const DashboardHeader = React.memo(({ }) => {
  const [searchQuery,setSearchQuery] = useState('')
  const {user,loading,logout} = useContext(AuthContext)
  if(loading) return <div>loading</div>

  const handleLogout = async()=>{
    await logout();
  }

  return (
    <header className="border-b border-border">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <FileIcon size={20} weight="fill" className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-text-primary font-heading">OpenDoc</h1>
        </div>

        <div className="flex items-center gap-4">
         
          <div className="relative">
            <MagnifyingGlassIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              data-testid="dashboard-search-input"
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-transparent border border-border focus:border-2 focus:border-borderStrong outline-none text-sm text-text-primary"
            />
          </div>

         
          <div className="flex items-center gap-3">
            <button data-testid="settings-button" className="p-2 hover:bg-surface transition-colors duration-150">
              <GearIcon size={20} className="text-text-secondary" />
            </button>
            <div className="w-8 h-8 bg-surface border border-border flex items-center justify-center">
              <span className="text-xs font-bold text-text-primary">{user?.user?.username?.slice(0,2).toUpperCase()}</span>
            </div>
            <button
              data-testid="logout-button"
              onClick={handleLogout}
              className="p-2 hover:bg-surface transition-colors duration-150"
              title="Logout"
            >
              <SignOutIcon size={20} className="text-text-secondary" />
            </button>
          </div>
        </div>
      </div>

    
    </header>
  );
});

export default DashboardHeader;