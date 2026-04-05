import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddUserBodySchema } from '@open-doc/shared'; 
import { orgApi } from '../services/orgApi'
import ErrorBanner from '../../../components/ui/ErrorBanner'; 
import { InviteStatusAlerts } from './InviteStatusAlert';

const InviteModal = ({ isOpen, onClose, orgId }) => {
  const [inviteSummary, setInviteSummary] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(AddUserBodySchema),
    mode: 'onTouched',
    defaultValues: {
      emails: "",
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      setInviteSummary(null); 
      clearErrors('root');
      
      const response = await orgApi.addUsers(orgId, data.emails);
      console.log(response);
      
      const { addedCount, nonExistentEmails = [], alreadyMembers = [] } = response.data;

      if (nonExistentEmails.length === 0 && alreadyMembers.length === 0) {
        reset();
        onClose();
        return;
      }

      setInviteSummary({ addedCount, nonExistentEmails, alreadyMembers });
      
    } catch (err) {
      console.error('[INVITE_MODAL_SUBMIT_ERROR]', err);
      
      const errorMessage = 
        err.response?.data?.message || 
        err.message || 
        'Failed to send invitations. Please try again.';
        
      setError('root', { 
        type: 'server', 
        message: errorMessage 
      });
    }
  };

  const handleCancel = () => {
    reset();
    setInviteSummary(null); 
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-text-primary/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-borderStrong w-full max-w-md shadow-2xl">
        
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-bold tracking-tight text-text-primary font-heading">
            Invite Members
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
            
            {errors.root && (
              <ErrorBanner message={errors.root.message} />
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-2">
                Email Addresses
              </label>
              <textarea
                data-testid="invite-emails-input"
                rows="4"
                className={`w-full px-4 py-3 bg-transparent border focus:border-2 focus:border-borderStrong outline-none text-text-primary resize-none font-mono text-sm transition-colors duration-150 ${
                  errors.emails ? 'border-red-500 focus:border-red-500' : 'border-border'
                }`}
                placeholder="colleague@company.com&#10;teammate@company.com"
                {...register('emails', {
                  onBlur: (e) => {
                    const array = e.target.value?.split('\n').map(em => em.trim()).filter(Boolean);
                    setValue('emails', array, { shouldValidate: true });
                    e.target.value = array.join('\n');
                  }
                })}
              />
              
              {errors.emails ? (
                <p className="text-xs text-red-500 mt-1">{errors.emails.message}</p>
              ) : (
                <p className="text-xs text-text-secondary mt-2">
                  Enter one email per line
                </p>
              )}
            </div>

            <InviteStatusAlerts summary={inviteSummary} />
          </div>

          <div className="border-t border-border p-6 flex gap-3 justify-end bg-gray-50">
            <button
              data-testid="cancel-invite-button"
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-3 border border-border hover:bg-surface text-xs font-bold uppercase tracking-[0.2em] text-text-primary transition-colors duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            
            <button
              data-testid="send-invites-button"
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-150 min-w-37.5"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Sending...
                </span>
              ) : (
                inviteSummary ? 'Try Again' : 'Send Invites'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;