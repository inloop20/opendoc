import React from 'react';

const WarningIcon = ({ size = 16 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const ErrorBanner = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border-2 border-red-600 p-4 mb-4 flex items-start gap-3 transition-all duration-200">
      <div className="text-red-600 mt-0.5">
        <WarningIcon size={18} />
      </div>
      
      <div className="flex-1 space-y-1">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
          System Error
        </h3>
        <p className="text-xs font-medium text-red-700 leading-relaxed">
          {message}
        </p>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-red-400 hover:text-red-700 transition-colors p-1 -mt-1 -mr-1"
          aria-label="Dismiss error"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;