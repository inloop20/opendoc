import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import OrgSidebar from '../features/organization-workspaces/components/OrgSidebar';
import OrgHeader from '../features/organization-workspaces/components/OrgHeader';
import WorkspaceGrid from '../features/organization-workspaces/components/WorkspaceGrid';
import {orgWorkspaceApi} from '../features/organization-workspaces/services/orgWorkspaceApi'
import ErrorBanner from '../components/ui/ErrorBanner'; 

const OrganizationWorkspaces = () => {
  const { orgId } = useParams(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [organization,setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(""); 

  useEffect(()=>{
    const getOrg = async()=>{
      setLoading(true);
    setApiError("");
     try {
       const org = await orgWorkspaceApi.getOrgById(orgId);
       console.log(org.data.canCreateWorkspace);
       
       setOrganization(org.data)
     } catch (error) {
      console.log(error);
      const message = error.response?.data?.message || error.message;
      setApiError(message || "Failed to load organizations. Please try again.");
     }finally{
      setLoading(false)
     }
    }
    getOrg();
  },[orgId])

  const allWorkspaces = [
    { id: 1, name: 'Product Documentation', orgId: '1', folders: 8, documents: 24, updatedAt: '2 hours ago' },
    { id: 2, name: 'Marketing Materials', orgId: '1', folders: 5, documents: 15, updatedAt: '1 day ago' },
    { id: 3, name: 'Client Projects', orgId: '2', folders: 12, documents: 48, updatedAt: '3 hours ago' }
  ];

  const orgWorkspaces = allWorkspaces.filter(ws => ws.orgId === orgId);
  if(loading) return <div>...loading</div>

  return (
    
    <div className="min-h-screen bg-white flex">
      <OrgSidebar 
        organization={organization}
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {apiError && (
    <div className="border-b border-red-100">
       <ErrorBanner 
         message={apiError} 
         onClose={() => setApiError("")} 
       />
    </div>
  )}
        <OrgHeader 
          orgName={organization?.name}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <WorkspaceGrid workspaces={orgWorkspaces} canCreateWorkspace={organization?.canCreateWorkspace} />
        </main>
      </div>
    </div>
  );
};

export default OrganizationWorkspaces;