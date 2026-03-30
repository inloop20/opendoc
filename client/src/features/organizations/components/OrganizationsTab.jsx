import { useNavigate } from 'react-router';
import { PlusIcon, UserPlusIcon, GearIcon } from '@phosphor-icons/react';

const OrganizationsTab = ({ onCreateOrg, onInvite }) => {
  const navigate = useNavigate();

  const organizations = [
    { id: 1, name: 'Acme Corp', role: 'Owner', members: 12 },
    { id: 2, name: 'Design Studio', role: 'Admin', members: 8 }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary font-heading mb-2">
            Organizations
          </h2>
          <p className="text-sm text-text-secondary">
            Manage your teams and members
          </p>
        </div>
        <button
          data-testid="create-organization-button"
          onClick={onCreateOrg}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary-hover transition-colors duration-150"
        >
          <PlusIcon size={16} weight="bold" />
          New Organization
        </button>
      </div>

      <div className="space-y-4">
        {organizations.map((org) => (
          /* 1. Changed outer container from <div> to <button> */
          <button
            key={org.id}
            data-testid={`organization-card-${org.id}`}
            onClick={() => navigate(`/organizations/${org.id}`)}
            className="w-full text-left border border-border p-6 bg-white hover:border-borderStrong hover:-translate-y-0.5 transition-all duration-150 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary flex items-center justify-center transition-colors duration-150 group-hover:bg-primary-hover">
                  <span className="text-lg font-black text-white">
                    {org.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-text-primary group-hover:text-primary transition-colors duration-150">
                    {org.name}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    {org.role} • {org.members} members
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* 2. Added e.stopPropagation() to prevent card click */}
                <button
                  data-testid={`invite-members-button-${org.id}`}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onInvite();
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-border bg-white hover:bg-surface text-xs font-semibold text-text-primary transition-colors duration-150"
                >
                  <UserPlusIcon size={16} />
                  Invite
                </button>
                
                {/* 3. Added e.stopPropagation() here as well */}
                <button
                  data-testid={`manage-org-button-${org.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Optional: navigate(`/organizations/${org.id}/settings`)
                  }}
                  className="p-2 border border-transparent hover:border-border hover:bg-surface transition-colors duration-150"
                >
                  <GearIcon size={20} className="text-text-secondary" />
                </button>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrganizationsTab;