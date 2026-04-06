import { useNavigate } from 'react-router';
import { FolderIcon, GearIcon } from '@phosphor-icons/react';
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
          onClick={() => navigate(`/organizations/${organization.id}/settings`)}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surfaceHover transition-colors duration-150 mt-1"
        >
          <GearIcon size={16} />
          Settings & Members
        </button>
    </Sidebar>
  );
};

export default OrgSidebar;