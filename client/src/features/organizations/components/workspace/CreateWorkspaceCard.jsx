import { useState } from 'react';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, XIcon, CircleNotch } from '@phosphor-icons/react';
import { orgWorkspaceApi } from '../../services/orgWorkspaceApi';
import ErrorBanner from '../../../../components/ui/ErrorBanner';
import {nameSchema} from '@open-doc/shared'

const CreateWorkspaceCard = ({refreshData}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { orgId } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: '' }
  });

  const onSubmit = async (data) => {
    try {
      setApiError(null);
      await orgWorkspaceApi.createWorkspace(orgId, data.name);
      reset();
      setIsModalOpen(false);
      if (refreshData) {
        await refreshData();
      }
    } catch (err) {
      setApiError(err.message || 'Failed to create workspace. Please try again.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setApiError(null);
    reset();
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        type="button"
        className="group flex flex-col items-center justify-center min-h-[240px] p-6 
                   bg-surface-secondary/30 rounded-xl border-2 border-dashed border-border 
                   hover:border-primary/50 hover:bg-surface-secondary/50 
                   transition-all duration-200 focus:outline-none"
      >
        <div className="w-12 h-12 mb-4 flex items-center justify-center bg-surface border border-border rounded-lg group-hover:scale-110 transition-transform">
          <PlusIcon size={24} weight="bold" className="text-text-tertiary group-hover:text-primary" />
        </div>
        <div className="text-center">
          <h4 className="text-sm font-semibold text-text-primary">Create Workspace</h4>
          <p className="text-xs text-text-secondary mt-1">Start a new project</p>
        </div>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-md rounded-2xl border border-border shadow-2xl">
            
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-semibold text-text-primary">New Workspace</h3>
              <button onClick={closeModal} className="text-text-tertiary hover:text-text-primary">
                <XIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              {apiError && (
                <div className="mb-4">
                  <ErrorBanner message={apiError} onClose={() => setApiError(null)} />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
                    Workspace Name
                  </label>
                  <input
                    {...register('name')}
                    autoFocus
                    placeholder="e.g. Engineering"
                    className={`w-full px-4 py-2.5 bg-surface-secondary border rounded-lg outline-none transition-all
                      ${errors.name ? 'border-red-500 focus:ring-red-500/10' : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/10'}`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.name.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-surface-secondary disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg 
                             hover:bg-primary-strong transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <CircleNotch size={18} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Workspace'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateWorkspaceCard;