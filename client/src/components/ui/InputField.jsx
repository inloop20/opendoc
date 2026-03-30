import React from 'react';

const InputField = React.forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div className="space-y-1 w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      
      <input
        ref={ref}
        {...props}
        className={`w-full p-2.5 border rounded-lg transition-colors duration-200 outline-none focus:ring-2 ${
          error 
            ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
            : 'border-border focus:ring-primary/20 focus:border-primary'
        }`}
      />
      
      {error && (
        <p className="text-red-500 text-xs mt-1 animate-fadeIn">
          {error.message}
        </p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';
export default InputField;