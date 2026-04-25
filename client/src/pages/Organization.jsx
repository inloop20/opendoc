import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import OrgSidebar from '../features/organizations/components/OrgSidebar';
import OrgHeader from '../features/organizations/components/OrgHeader';
import WorkspaceGrid from '../features/organizations/components/workspace/WorkspaceGrid';
import {orgWorkspaceApi} from '../features/organizations/services/orgWorkspaceApi'
import ErrorBanner from '../components/ui/ErrorBanner'; 

const Organization = () => {
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
       setOrganization(org.data)
     } catch (error) {
      const message = error.response?.data?.message || error.message;
      setApiError(message || "Failed to load organizations. Please try again.");
     }finally{
      setLoading(false)
     }
    }
    getOrg();
  },[orgId])



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
          <WorkspaceGrid />
        </main>
      </div>
    </div>
  );
};

export default Organization;