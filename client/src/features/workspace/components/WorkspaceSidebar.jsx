import { useNavigate } from 'react-router';
import { File, House, Folder, FolderPlus, SignOut } from '@phosphor-icons/react';

const WorkspaceSidebar = ({ 
  workspace, 
  folders, 
  selectedFolder, 
  onSelectFolder, 
  onCreateFolderClick, 
  onLogout 
}) => {
  const navigate = useNavigate();
  
  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col">
      {/* Logo Area */}
      <div className="p-4 border-b border-border">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity duration-150"
        >
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <File size={16} weight="fill" className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tighter text-text-primary font-heading">
            OpenDoc
          </span>
        </button>
      </div>

      {/* Workspace Info */}
      <div className="p-4 border-b border-border">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-2">
          Workspace
        </p>
        <h2 className="text-sm font-semibold text-text-primary">{workspace.name}</h2>
        <p className="text-xs text-text-secondary mt-1">{workspace.org}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        {/* All Documents Link */}
        <div className="p-2">
          <button
            onClick={() => onSelectFolder(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-150 ${
              !selectedFolder 
                ? 'bg-text-primary text-white' 
                : 'text-text-primary hover:bg-surfaceHover'
            }`}
          >
            <House size={16} />
            All Documents
          </button>
        </div>

        {/* Folders List */}
        <div className="p-2">
          <div className="flex items-center justify-between px-3 py-2 mb-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary">
              Folders
            </p>
            <button
              onClick={onCreateFolderClick}
              className="hover:bg-surfaceHover p-1 transition-colors duration-150"
            >
              <FolderPlus size={14} className="text-text-secondary" />
            </button>
          </div>

          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => onSelectFolder(folder.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm mb-1 transition-colors duration-150 ${
                selectedFolder === folder.id 
                  ? 'bg-text-primary text-white' 
                  : 'text-text-primary hover:bg-surfaceHover'
              }`}
            >
              <div className="flex items-center gap-2">
                <Folder size={16} />
                <span className="truncate">{folder.name}</span>
              </div>
              <span className="text-xs opacity-70">{folder.documents}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* User Section & Logout */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white border border-border flex items-center justify-center">
              <span className="text-xs font-bold text-text-primary">JD</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary">John Doe</p>
            </div>
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

export default WorkspaceSidebar;