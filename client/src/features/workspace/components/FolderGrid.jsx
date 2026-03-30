import { Folder, DotsThree } from '@phosphor-icons/react';

const FolderGrid = ({ folders, onSelectFolder }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-4">Folders</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onSelectFolder(folder.id)}
            className="text-left border border-border hover:border-borderStrong transition-all duration-150 hover:-translate-y-px p-4 group"
          >
            <div className="flex items-start justify-between mb-3">
              <Folder size={24} className="text-text-primary" />
              <button
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface transition-all duration-150"
              >
                <DotsThree size={16} className="text-text-secondary" />
              </button>
            </div>
            <h4 className="text-sm font-semibold text-text-primary mb-1 truncate">{folder.name}</h4>
            <p className="text-xs text-text-secondary">{folder.documents} documents</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FolderGrid;