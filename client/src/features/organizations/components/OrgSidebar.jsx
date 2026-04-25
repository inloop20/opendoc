import { useNavigate } from 'react-router';
import { FolderIcon, GearIcon, UsersIcon } from '@phosphor-icons/react';
import Sidebar from '../../../components/ui/Sidebar';

const OrgSidebar = ({ organization }) => {
  const navigate = useNavigate();

  return (
    <Sidebar headerLabel={'Organization'} headerTitle={organization?.name} memberCount={organization?._count?.organization_member}>
      
      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-text-primary text-white">
          <FolderIcon size={16} />
          Workspaces
        </button>
       <button
          onClick={() => navigate(`/organizations/${organization?.id}/settings`)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm text-text-primary hover:bg-surface-secondary rounded-lg transition-colors mt-1 group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <GearIcon size={16} /> 
            <span>Settings & Members</span>
          </div>
          
          
        </button>
    </Sidebar>
  );
};

export default OrgSidebar;