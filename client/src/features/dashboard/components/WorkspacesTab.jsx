import { useNavigate } from 'react-router';
import { PlusIcon, FolderIcon, CaretRightIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { dashboardWorkspaceApi } from '../services/dashboardWorkspaceApi';
import ErrorBanner from '../../../components/ui/ErrorBanner';

const WorkspacesTab = () => {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await dashboardWorkspaceApi.getMyWorkspace();
        setWorkspaces(res.data || []);
      } catch (err) {
        setError(
          err?.message ||
          "Failed to load workspaces"
        );
      } finally {
         setLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary font-heading mb-2">Workspaces</h2>
          <p className="text-sm text-text-secondary">Organize your documents by project or team</p>
        </div>
      </div>

      {error && (
        <ErrorBanner
          message={error}
          onClose={() => setError("")}
        />
      )}

      {loading ? (
        <div className="text-sm text-text-secondary">Loading workspaces...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((workspace) => (    
            <button
              key={workspace?.workspace?.id}
              onClick={() => navigate(`/workspace/${workspace?.workspace?.id}`)}
              className="text-left border border-border hover:border-borderStrong transition-all duration-150 hover:-translate-y-px bg-white p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-surface border border-border flex items-center justify-center">
                  <FolderIcon size={20} className="text-text-primary" />
                </div>
                <CaretRightIcon size={16} className="text-text-secondary" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-text-primary mb-1">
                {workspace?.workspace?.name}
              </h3>

              <p className="text-xs text-text-secondary mb-4">
                {workspace?.workspace?.organization?.name ||  "—"}
              </p>

              <div className="flex items-center gap-4 text-xs text-text-secondary">
                <span>{workspace?.workspace?._count?.folders || 0} folders</span>
                
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-xs text-text-secondary">
                  Updated {workspace?.workspace?.updated_at || "recently"}
                </span>
              </div>
            </button>
          ))}

          {!loading && workspaces?.length === 0 && !error && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl">
              <p className="text-sm text-text-secondary">
                No workspaces yet.
              </p>
              <p className="text-xs text-text-tertiary mt-1">
                Create your first workspace to get started.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkspacesTab;