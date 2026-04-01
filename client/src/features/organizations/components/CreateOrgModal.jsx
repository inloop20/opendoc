import { orgApi } from "../services/orgApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {orgCreateSchema} from '@open-doc/shared'
import InputField from '../../../components/ui/InputField'

const CreateOrgModal = ({ isOpen, onClose,setOrgs }) => {
 
  const {
    register,
    handleSubmit,
     setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(orgCreateSchema),
    defaultValues: {
      orgName: "",
    },
  });
  
   if (!isOpen) return null;

  const onSubmit = handleSubmit(async (data) => {
    
    try {
     const org= await orgApi.createOrg(data.name);
     console.log(org);
     
      setOrgs((prev)=> [...prev,{...org.data,role:'admin',memberCount:1}])
      onClose();
    } catch (error) {
          setError('root', { 
        type: 'manual', 
        message: error.message || 'Invalid credentials. Please try again.' 
      });
    }
  });

  return (
    <div className="fixed inset-0 bg-text-primary/50 flex items-center justify-center z-50 p-4">
      <form 
        onSubmit={onSubmit} 
        className="bg-white border-2 border-borderStrong w-full max-w-md"
      >
          {errors.root && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {errors.root.message}
        </div>
      )}
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-bold tracking-tight text-text-primary font-heading">
            Create Organization
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-2">
              Organization Name
            </label>
            <InputField
              type="text"
              error={errors.name}
              placeholder="e.g., Acme Corp"
              {...register("name")}
            />
            
           
          </div>
        </div>

        <div className="border-t border-border p-6 flex gap-3 justify-end">
          <button
            type="button"
            data-testid="cancel-org-button"
            onClick={() => {
              onClose()
            }}
            className="px-6 py-3 border border-border hover:bg-surface text-xs font-bold uppercase tracking-[0.2em] text-text-primary transition-colors duration-150"
          >
            Cancel
          </button>
          
          <button
            type="submit" 
            disabled={isSubmitting}
            className={`px-6 py-3 text-white font-bold text-xs uppercase tracking-[0.2em] transition-colors duration-150 ${
              isSubmitting 
                ? "bg-primary/50 cursor-not-allowed" 
                : "bg-primary hover:bg-primary-hover"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrgModal;