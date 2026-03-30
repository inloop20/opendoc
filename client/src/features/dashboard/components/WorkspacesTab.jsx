import { useNavigate } from 'react-router';
import { PlusIcon, FolderIcon, CaretRightIcon } from '@phosphor-icons/react';

const WorkspacesTab = () => {
  const navigate = useNavigate();
  
  const workspaces = [
    { id: 1, name: 'Product Documentation', org: 'Acme Corp', folders: 8, documents: 24, updatedAt: '2 hours ago' },
    { id: 2, name: 'Marketing Materials', org: 'Acme Corp', folders: 5, documents: 15, updatedAt: '1 day ago' },
    { id: 3, name: 'Client Projects', org: 'Design Studio', folders: 12, documents: 48, updatedAt: '3 hours ago' }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary font-heading mb-2">Workspaces</h2>
          <p className="text-sm text-text-secondary">Organize your documents by project or team</p>
        </div>
        <button
          data-testid="create-workspace-button"
          onClick={() => navigate('/workspace/new')}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary-hover transition-colors duration-150"
        >
          <PlusIcon size={16} weight="bold" />
          New Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workspaces.map((workspace) => (
          <button
            key={workspace.id}
            data-testid={`workspace-card-${workspace.id}`}
            onClick={() => navigate(`/workspace/${workspace.id}`)}
            className="text-left border border-border hover:border-borderStrong transition-all duration-150 hover:-translate-y-px bg-white p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-surface border border-border flex items-center justify-center">
                <FolderIcon size={20} className="text-text-primary" />
              </div>
              <CaretRightIcon size={16} className="text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-text-primary mb-1">{workspace.name}</h3>
            <p className="text-xs text-text-secondary mb-4">{workspace.org}</p>
            <div className="flex items-center gap-4 text-xs text-text-secondary">
              <span>{workspace.folders} folders</span>
              <span>•</span>
              <span>{workspace.documents} docs</span>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <span className="text-xs text-text-secondary">Updated {workspace.updatedAt}</span>
            </div>
          </button>
        ))}

        <button
          data-testid="create-workspace-card"
          onClick={() => navigate('/workspace/new')}
          className="border-2 border-dashed border-border hover:border-borderStrong transition-colors duration-150 p-6 flex flex-col items-center justify-center min-h-60"
        >
          <div className="w-12 h-12 bg-surface border border-border flex items-center justify-center mb-3">
            <PlusIcon size={24} className="text-text-secondary" />
          </div>
          <p className="text-sm font-semibold text-text-primary">Create Workspace</p>
          <p className="text-xs text-text-secondary mt-1">Start a new project</p>
        </button>
      </div>
    </div>
  );
};

export default WorkspacesTab;