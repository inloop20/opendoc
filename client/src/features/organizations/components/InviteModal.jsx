const InviteModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-text-primary/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-borderStrong w-full max-w-md">
        
        {/* Modal Header */}
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-bold tracking-tight text-text-primary font-heading">
            Invite Members
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-2">
                Email Addresses
              </label>
              <textarea
                data-testid="invite-emails-input"
                rows="4"
                className="w-full px-4 py-3 bg-transparent border border-border focus:border-2 focus:border-borderStrong outline-none text-text-primary resize-none font-mono text-sm"
                placeholder="colleague@company.com&#10;teammate@company.com&#10;partner@company.com"
                required
              />
              <p className="text-xs text-text-secondary mt-2">
                Enter one email per line
              </p>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-2">
                Role
              </label>
              <select
                data-testid="invite-role-select"
                className="w-full px-4 py-3 bg-transparent border border-border focus:border-2 focus:border-borderStrong outline-none text-text-primary"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>

          <div className="border-t border-border p-6 flex gap-3 justify-end">
            <button
              data-testid="cancel-invite-button"
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-border hover:bg-surface text-xs font-bold uppercase tracking-[0.2em] text-text-primary transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              data-testid="send-invites-button"
              type="submit"
              className="px-6 py-3 bg-primary text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary-hover transition-colors duration-150"
            >
              Send Invites
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;