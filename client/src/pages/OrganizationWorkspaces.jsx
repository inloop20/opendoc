import { useState } from 'react';
import { useParams } from 'react-router';

// Component Imports
import OrgSidebar from '../features/organization-workspaces/components/OrgSidebar';
import OrgHeader from '../features/organization-workspaces/components/OrgHeader';
import WorkspaceGrid from '../features/organization-workspaces/components/WorkspaceGrid';

const OrganizationWorkspaces = ({ onLogout }) => {
  const { orgId } = useParams(); 
  const [searchQuery, setSearchQuery] = useState('');

  // Simulated DB Query
  const organization = {
    id: orgId,
    name: orgId === '1' ? 'Acme Corp' : 'Design Studio',
    members: 12
  };

  const allWorkspaces = [
    { id: 1, name: 'Product Documentation', orgId: '1', folders: 8, documents: 24, updatedAt: '2 hours ago' },
    { id: 2, name: 'Marketing Materials', orgId: '1', folders: 5, documents: 15, updatedAt: '1 day ago' },
    { id: 3, name: 'Client Projects', orgId: '2', folders: 12, documents: 48, updatedAt: '3 hours ago' }
  ];

  const orgWorkspaces = allWorkspaces.filter(ws => ws.orgId === orgId);

  return (
    <div className="min-h-screen bg-white flex">
      {/* 1. Sidebar */}
      <OrgSidebar 
        organization={organization}
        orgId={orgId}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col">
        {/* 2. Header */}
        <OrgHeader 
          orgName={organization.name}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* 3. Main Workspace Grid */}
        <main className="flex-1 p-8 overflow-y-auto">
          <WorkspaceGrid workspaces={orgWorkspaces} />
        </main>
      </div>
    </div>
  );
};

export default OrganizationWorkspaces;