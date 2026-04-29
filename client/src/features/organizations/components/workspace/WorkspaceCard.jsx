import { useNavigate } from 'react-router';
import { FolderIcon, CaretRightIcon } from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';

const WorkspaceCard = ({ workspace }) => {
const navigate = useNavigate();

const formatDate = (dateString) => {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
     hour: '2-digit',
     minute: '2-digit',
  }).format(date);
};
  return (
    <button
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
      
      <div className="flex items-center gap-4 text-xs text-text-secondary">
        <span>{workspace._count.folders} folders</span>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <span className="text-xs text-text-secondary">Last updated {formatDate(workspace.updated_at)}</span>
      </div>
    </button>
  );
};

export default WorkspaceCard;