import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createDocumentSchema } from '@open-doc/shared/index';
import workspaceApi from '../services/workspaceApi';
import ErrorBanner from '../../../components/ui/ErrorBanner';

const CreateDocumentModal = ({ workspaceId, parentId, onClose, onSuccess }) => {
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createDocumentSchema),
    defaultValues: { 
      title: "",
      
    }
  });

  const onSubmit = async (data) => {
    
    try {
      setIsSubmitting(true);
      setApiError(null);

      await workspaceApi.createDocument(
        parentId,
        data.title,
      );

      onSuccess(); 
    } catch (err) {
      setApiError(err?.message || "Failed to create document.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-text-primary/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-borderStrong w-full max-w-md shadow-xl">
        
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-bold tracking-tight text-text-primary font-heading">Create Document</h2>
        </div>
        {(apiError || errors.title) && (
          <div className="px-6 pt-4">
            <ErrorBanner 
              message={apiError || errors.title?.message} 
              onClose={() => setApiError(null)} 
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-2">
                Document Name
              </label>
              <input
                {...register("title")}
                type="text"
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-transparent border outline-none text-text-primary transition-all ${
                  errors.title 
                    ? "border-error" 
                    : "border-border focus:border-2 focus:border-borderStrong"
                }`}
                placeholder="e.g., Q1 Strategy"
                autoFocus
              />
              
            </div>          
          </div>

          <div className="border-t border-border p-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 border border-border hover:bg-surface text-xs font-bold uppercase tracking-[0.2em] text-text-primary transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary-hover transition-colors disabled:bg-primary/50"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDocumentModal;