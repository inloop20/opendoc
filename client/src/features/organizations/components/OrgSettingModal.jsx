import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import InputField from "../../../components/ui/InputField";
import ConfirmationModal from "../../../components/ConfirmationModal";
import ErrorBanner from "../../../components/ui/ErrorBanner"; 
import { orgApi } from "../services/orgApi";
import { orgCreateSchema as orgSettingsSchema } from "@open-doc/shared";

const OrgSettingsModal = ({ isOpen, onClose, organization,setOrgs }) => {
  const [apiError, setApiError] = useState(""); 
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(orgSettingsSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (organization) {
      reset({ name: organization.name });
      setApiError(""); 
    }
  }, [organization, reset]);

  if (!isOpen || !organization) return null;

  const onSubmit = async (data) => {
    setApiError("");
    try {
    await orgApi.updateOrg(organization.id, { name: data.name }); 
      setOrgs((prev => prev.map(o => o.id === organization.id ? {...organization, name:data.name} : o)))
      onClose();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.log(message);
      
      if (message?.toLowerCase().includes("name")) {
        setError("name", { type: "server", message });
      } else {
        setApiError(message || "An unexpected error occurred.");
      }
    }
  };

  const handleDelete = async () => {
    setApiError(""); 
    setIsDeleting(true);
    try {
      await orgApi.deleteOrg(organization.id);
      setShowDeleteConfirm(false);
      setOrgs(prev=> prev.filter(org=> org.id !== organization.id))
      onClose();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setApiError(`Failed to delete organization: ${message}`);
      setShowDeleteConfirm(false); 
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-text-primary/50 flex items-center justify-center z-50 p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white border-2 border-borderStrong w-full max-w-md">
          
          <div className="border-b border-border p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold tracking-tight text-text-primary font-heading">
              Organization Settings
            </h2>
            <span className="text-xs font-mono text-text-secondary bg-surface px-2 py-1 border border-border">
              ID: {organization.id.slice(0, 8)}...
            </span>
          </div>

          <div className="p-6 space-y-4">
            
            {apiError && (
              <ErrorBanner 
                message={apiError} 
                onClose={() => setApiError("")} 
              />
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-2">
                Organization Name
              </label>
              <InputField
                type="text"
                {...register("name")}
                error={errors.name}
                placeholder="e.g., Acme Corp"
              />
            </div>

            <div className="pt-2">
              <p className="text-xs text-text-secondary">
                You are currently an <strong className="text-text-primary uppercase">{organization.role}</strong> in this organization.
              </p>
            </div>
          </div>

          <div className="border-t border-border p-6 flex justify-between items-center gap-3">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-3 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-[0.2em] transition hover:bg-red-50"
            >
              Delete
            </button>

            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => {
                  setApiError("");
                  onClose();
                }} 
                className="px-6 py-3 border border-border hover:bg-surface text-xs font-bold uppercase tracking-[0.2em] text-text-primary transition"
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className={`px-6 py-3 text-white font-bold text-xs uppercase tracking-[0.2em] transition ${isSubmitting ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:bg-primary-hover"}`}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Organization"
        message={`Are you absolutely sure? This will permanently delete "${organization.name}" and all of its associated workspaces and documents.`}
        confirmText="Permanently Delete"
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
};

export default OrgSettingsModal;