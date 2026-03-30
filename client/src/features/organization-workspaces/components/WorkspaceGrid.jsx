import WorkspaceCard from './WorkspaceCard';
import CreateWorkspaceCard from './CreateWorkspaceCard';

const WorkspaceGrid = ({ workspaces }) => {
  return (
    <>
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-4">
        Active Workspaces
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workspaces.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
        
        <CreateWorkspaceCard />
      </div>
    </>
  );
};

export default WorkspaceGrid;