import { useParams, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import WorkspaceSidebar from "../components/WorkspaceSidebar";

const WorkspaceLayout = () => {
  const { workspaceId } = useParams();
  const location = useLocation();

  const { workspace, loadWorkspace, loading } = useWorkspace();

  const [activeDocId, setActiveDocId] = useState(null);

  useEffect(() => {
    if (workspaceId) {
      loadWorkspace(workspaceId);
    }
  }, [workspaceId, loadWorkspace]);

  const isSettingsPage = location.pathname.includes("/settings");

  const handleSelectDocument = useCallback((docId, path) => {
    setActiveDocId(docId);
  }, []);

  if (loading && !workspace) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading workspace...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">

      {!isSettingsPage && (
        <WorkspaceSidebar
          workspace={workspace}
          onSelectDocument={handleSelectDocument}   
        />
      )}

      <div className="flex-1 flex flex-col">
        <Outlet
          context={{
            workspace,
            activeDocId,      
          }}
        />
      </div>

    </div>
  );
};

export default WorkspaceLayout;