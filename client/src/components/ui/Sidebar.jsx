import { useNavigate } from 'react-router';
import {  FileIcon, SignOut, UsersIcon } from '@phosphor-icons/react';
import { useContext } from 'react';
import {AuthContext} from '../../features/auth/context/AuthContext'

const Sidebar = ({ headerLabel, headerTitle, headerSubtitle,memberCount, children }) => {

  const navigate = useNavigate();
   const {user,loading,logout} = useContext(AuthContext);
   console.log(user);
   
   const handleLogout = async()=>{
    await logout();
  }
  if(loading) return <div>...loading</div>
  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col h-screen">
      <div className="p-4 border-b border-border">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity duration-150"
        >
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <FileIcon size={16} weight="fill" className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tighter text-text-primary font-heading">
            OpenDoc
          </span>
        </button>
      </div>

      <div className="p-4 border-b border-border bg-white/50">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-2">
          {headerLabel}
        </p>
        <h2 className="text-sm font-semibold text-text-primary">{headerTitle}</h2>
        {headerSubtitle && (
          <p className="text-xs text-text-secondary mt-1">{headerSubtitle}</p>
        )}
          <div className="flex items-center gap-2 mt-1">
            <UsersIcon size={12} className="text-text-secondary" />
              <p className="text-xs text-text-secondary">{memberCount} members</p>
          </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {children}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white border border-border flex items-center justify-center text-xs font-bold text-text-primary">
              {user?.user?.username?.slice(0,2).toUpperCase()}
            </div>
            <p className="text-xs font-semibold text-text-primary">{user?.user?.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-surfaceHover transition-colors duration-150"
          >
            <SignOut size={16} className="text-text-secondary" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;