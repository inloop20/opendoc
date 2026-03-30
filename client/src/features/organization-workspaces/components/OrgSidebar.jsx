import { useNavigate } from 'react-router';
import { File, FolderIcon, GearIcon, Users, SignOut } from '@phosphor-icons/react';

const OrgSidebar = ({ organization, orgId, onLogout }) => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity duration-150"
        >
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <File size={16} weight="fill" className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tighter text-text-primary font-heading">OpenDoc</span>
        </button>
      </div>

      {/* Focus Info */}
      <div className="p-4 border-b border-border bg-white">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-2">Organization</p>
        <h2 className="text-sm font-semibold text-text-primary">{organization.name}</h2>
        <div className="flex items-center gap-2 mt-1">
          <Users size={12} className="text-text-secondary" />
          <p className="text-xs text-text-secondary">{organization.members} members</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto p-2">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-text-primary text-white">
          <FolderIcon size={16} />
          Workspaces
        </button>
        <button
          onClick={() => navigate(`/organizations/${orgId}/settings`)}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surfaceHover transition-colors duration-150 mt-1"
        >
          <GearIcon size={16} />
          Settings & Members
        </button>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white border border-border flex items-center justify-center">
              <span className="text-xs font-bold text-text-primary">JD</span>
            </div>
            <p className="text-xs font-semibold text-text-primary">John Doe</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2 hover:bg-surfaceHover transition-colors duration-150"
            title="Logout"
          >
            <SignOut size={16} className="text-text-secondary" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default OrgSidebar;