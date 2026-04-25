import WorkspaceCard from './WorkspaceCard';
import CreateWorkspaceCard from './CreateWorkspaceCard';
import ErrorBanner from '../../../../components/ui/ErrorBanner'
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { orgWorkspaceApi } from '../../services/orgWorkspaceApi';
import {useOrgPermissions} from '../../hooks/useOrgPermission'
import { PlusIcon } from '@phosphor-icons/react';

const WorkspaceGrid = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orgId } = useParams(); 

  const { permissions, loading: permLoading } = useOrgPermissions(orgId)
  
    
    const fetchWorkspaces = useCallback(async (showLoading = true) => {
      try {        
       if(showLoading) setIsLoading(true);
        setError(null); 
        const response = await orgWorkspaceApi.getWorkspaces(orgId);
        setWorkspaces(response.data || []);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    });
    useEffect(()=>{

        if (orgId) fetchWorkspaces();
      }, [orgId]);
    

  if (isLoading || permLoading) {
    return (
      <div>
        ...loading
      </div>
    );
  }
  
  return (
    <>
    {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onClose={() => setError(null)} />
        </div>
      )}
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-4">
        Active Workspaces
      </h3>
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {permissions?.canManageOrg && 
       <CreateWorkspaceCard  refreshData={()=>fetchWorkspaces(false)}/>
      } 
        {workspaces.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
        
   

     

      {!permissions?.canManageOrg && workspaces.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl">
              <p className="text-sm text-text-secondary">You don't have access to any workspaces yet.</p>
              <p className="text-xs text-text-tertiary mt-1">Contact your administrator for access.</p>
            </div>
          )}
      </div>
    </>
  );
};

export default WorkspaceGrid;