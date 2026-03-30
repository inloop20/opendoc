import { useNavigate } from 'react-router';
import { PlusIcon } from '@phosphor-icons/react';

const CreateWorkspaceCard = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/workspace/new')}
      className="border-2 border-dashed border-border hover:border-borderStrong transition-colors duration-150 p-6 flex flex-col items-center justify-center min-h-60"
    >
      <div className="w-12 h-12 bg-surface border border-border flex items-center justify-center mb-3">
        <PlusIcon size={24} className="text-text-secondary" />
      </div>
      <p className="text-sm font-semibold text-text-primary">Create Workspace</p>
      <p className="text-xs text-text-secondary mt-1">Start a new project for this team</p>
    </button>
  );
};

export default CreateWorkspaceCard;