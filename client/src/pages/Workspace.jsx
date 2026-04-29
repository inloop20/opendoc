import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import workspaceApi from '../features/workspace/services/workspaceApi';
import WorkspaceSidebar from '../features/workspace/components/WorkspaceSidebar';
import WorkspaceHeader from '../features/workspace/components/WorkspaceHeader';
import DocumentView from '../features/workspace/components/DocumentView';
import ErrorBanner from '../components/ui/ErrorBanner';

const WorkspacePage = () => {
  const { workspaceId } = useParams();
  
  const [workspace, setWorkspace] = useState(null);
  const [activeDocId, setActiveDocId] = useState(null);
  const [breadcrumbPath, setBreadcrumbPath] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchWorkspace = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await workspaceApi.getWorkspace(workspaceId);
      setWorkspace(response.data);
    } catch (err) {
      setError(err?.message || "Failed to load workspace details.");
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  const handleSelectDocument = (id, path) => {
    setActiveDocId(id);
    setBreadcrumbPath(path);
  };

  const handleReset = () => {
    setActiveDocId(null);
    setBreadcrumbPath([]);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full p-10 flex items-center justify-center">
        <ErrorBanner message={error} onRetry={fetchWorkspace} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
    
      <WorkspaceSidebar 
        workspace={workspace}
        onSelectDocument={handleSelectDocument}
        onReset={handleReset}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full">
       
        <WorkspaceHeader 
          path={breadcrumbPath} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
      
        <main 
          className="flex-1 overflow-y-auto bg-white relative"
          onClick={handleReset}
        >
          {activeDocId ? (
            <div className="h-full" onClick={(e) => e.stopPropagation()}>
              <DocumentView docId={activeDocId} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-text-secondary select-none italic">
              Select a file from the explorer to begin
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default WorkspacePage;