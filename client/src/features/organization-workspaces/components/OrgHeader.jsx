import { useNavigate } from 'react-router';
import { CaretRightIcon, MagnifyingGlass, PlusIcon } from '@phosphor-icons/react';

const OrgHeader = ({ orgName, searchQuery, onSearchChange }) => {
  const navigate = useNavigate();

  const breadcrumbs = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: orgName, path: null }
  ];

  return (
    <header className="border-b border-border">
      <div className="px-8 py-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-4">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <CaretRightIcon size={12} className="text-text-secondary" />}
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

        {/* Search and Action Bar */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 bg-transparent border border-border focus:border-2 focus:border-borderStrong outline-none text-sm text-text-primary"
            />
          </div>

          <button
            onClick={() => navigate('/workspace/new')}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary-hover transition-colors duration-150"
          >
            <PlusIcon size={16} weight="bold" />
            New Workspace
          </button>
        </div>
      </div>
    </header>
  );
};

export default OrgHeader;