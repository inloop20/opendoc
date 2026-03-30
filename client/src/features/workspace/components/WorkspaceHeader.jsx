import { useNavigate } from 'react-router';
import { CaretRight, MagnifyingGlass, FolderPlus, FilePlus } from '@phosphor-icons/react';

const WorkspaceHeader = ({ workspace, folders, selectedFolder, searchQuery, onSearchChange, onCreateFolder, onCreateDoc }) => {
  const navigate = useNavigate();

  // Breadcrumb generator
  const breadcrumbs = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: workspace.name, path: null }
  ];

  if (selectedFolder) {
    const folder = folders.find(f => f.id === selectedFolder);
    if (folder) {
      breadcrumbs.push({ name: folder.name, path: null });
    }
  }

  return (
    <header className="border-b border-border">
      <div className="px-8 py-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-4">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <CaretRight size={12} className="text-text-secondary" />}
              {crumb.path ? (
                <button
                  onClick={() => navigate(crumb.path)}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150"
                >
                  {crumb.name}
                </button>
              ) : (
                <span className="text-sm font-semibold text-text-primary">{crumb.name}</span>
              )}
            </div>
          ))}
        </div>

        {/* Search and Actions */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 bg-transparent border border-border focus:border-2 focus:border-borderStrong outline-none text-sm text-text-primary"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCreateFolder}
              className="flex items-center gap-2 px-4 py-2 border border-border hover:bg-surface text-xs font-semibold text-text-primary transition-colors duration-150"
            >
              <FolderPlus size={16} />
              New Folder
            </button>
            <button
              onClick={onCreateDoc}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary-hover transition-colors duration-150"
            >
              <FilePlus size={16} weight="bold" />
              New Document
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WorkspaceHeader;