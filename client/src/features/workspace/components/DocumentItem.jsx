import { useNavigate } from 'react-router';
import { File, PencilSimple, Trash } from '@phosphor-icons/react';

const DocumentItem = ({ doc, isLast }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`flex items-center justify-between p-4 hover:bg-surface transition-colors duration-150 group ${
        !isLast ? 'border-b border-border' : ''
      }`}
    >
      <button
        onClick={() => navigate(`/document/${doc.id}`)}
        className="flex items-center gap-4 flex-1 text-left"
      >
        <div className="w-10 h-10 bg-white border border-border flex items-center justify-center">
          <File size={20} className="text-text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-text-primary mb-1">{doc.name}</h4>
          <p className="text-xs text-text-secondary">
            Updated {doc.updatedAt} by {doc.author}
          </p>
        </div>
      </button>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          className="p-2 hover:bg-surfaceHover transition-colors duration-150"
          title="Edit"
        >
          <PencilSimple size={16} className="text-text-secondary" />
        </button>
        <button
          className="p-2 hover:bg-surfaceHover transition-colors duration-150"
          title="Delete"
        >
          <Trash size={16} className="text-error" />
        </button>
      </div>
    </div>
  );
};

export default DocumentItem;