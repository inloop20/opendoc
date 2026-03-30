import { useNavigate } from 'react-router';

const CreateDocumentModal = ({ folders, onClose }) => {
  const navigate = useNavigate();

  const handleCreate = () => {
    onClose();
    navigate('/document/new');
  };

  return (
    <div className="fixed inset-0 bg-text-primary/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-borderStrong w-full max-w-md">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-bold tracking-tight text-text-primary font-heading">Create Document</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-2">
              Document Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-transparent border border-border focus:border-2 focus:border-borderStrong outline-none text-text-primary"
              placeholder="e.g., Introduction Guide"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-2">
              Folder
            </label>
            <select className="w-full px-4 py-3 bg-transparent border border-border focus:border-2 focus:border-borderStrong outline-none text-text-primary">
              <option value="">No folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="border-t border-border p-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-border hover:bg-surface text-xs font-bold uppercase tracking-[0.2em] text-text-primary transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-primary text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary-hover transition-colors duration-150"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDocumentModal;