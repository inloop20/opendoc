import React from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger" 
}) => {
  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 bg-text-primary/50 flex items-center justify-center z-60 p-4">
      <div className="bg-white border-2 border-borderStrong w-full max-w-md">
        
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-bold tracking-tight text-text-primary font-heading">
            {title}
          </h2>
        </div>

        <div className="p-6">
          <div className={`p-4 border ${
            isDanger ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
          }`}>
            <p className={`text-sm font-semibold mb-1 ${
              isDanger ? "text-red-700" : "text-amber-700"
            }`}>
              Warning
            </p>
            <p className={`text-xs ${
              isDanger ? "text-red-600" : "text-amber-600"
            }`}>
              {message}
            </p>
          </div>
        </div>

        <div className="border-t border-border p-6 flex gap-3 justify-end">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isLoading}
            className="px-6 py-3 border border-border hover:bg-surface text-xs font-bold uppercase tracking-[0.2em] text-text-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          
          <button 
            type="button"
            onClick={onConfirm}
            disabled={isLoading} 
            className={`px-6 py-3 text-white font-bold text-xs uppercase tracking-[0.2em] transition ${
              isDanger 
                ? isLoading ? "bg-red-500/50 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                : isLoading ? "bg-amber-500/50 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmationModal;