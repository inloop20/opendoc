import { useNavigate } from 'react-router';
import { PlusIcon, UserPlusIcon, GearIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import CreateOrgModal from './CreateOrgModal';
import InviteModal from './InviteModal';
import { orgApi } from '../services/orgApi';
import OrgSettingsModal from './OrgSettingModal';
import ErrorBanner from '../../../components/ui/ErrorBanner'; 

const OrganizationsTab = () => {
  const navigate = useNavigate();

  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(""); 

  useEffect(() => {
    const gc = async () => {
      setApiError("");
      try {
        const org = await orgApi.getUserOrgs();
        setOrgs(org.data);
      } catch (error) {
        console.log(message)
        const message = error.response?.data?.message || error.message;
        setApiError(message || "Failed to load organizations. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    gc();
  }, []);

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
          onClick={() => setShowCreateOrgModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-semibold uppercase tracking-wider hover:bg-primary-hover transition"
        >
          <PlusIcon size={16} weight="bold" />
          New Organization
        </button>
      </div>
      {apiError && (
        <ErrorBanner 
          message={apiError} 
          onClose={() => setApiError("")} 
        />
      )}

      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-text-secondary">Loading organizations...</p>
        ) : orgs.length === 0 && !apiError ? (
          <div className="text-center py-10 border border-dashed border-border">
            <p className="text-sm text-text-secondary mb-4">
              No organizations yet
            </p>
            <button
              onClick={() => setShowCreateOrgModal(true)}
              className="text-primary text-sm font-semibold hover:underline"
            >
              Create your first organization
            </button>
          </div>
        ) : (
          orgs.map((org) => (
            <div
              key={org.id}
              onClick={() => navigate(`/organizations/${org?.id}`)}
              className="p-5 border border-border bg-white hover:border-borderStrong hover:shadow-sm transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-primary flex items-center justify-center text-white font-bold text-lg">
                    {org?.name?.charAt(0)}
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-text-primary group-hover:text-primary transition">
                      {org?.name}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1">
                      {org?.role} • {org?.memberCount} members
                    </p>
                  </div>
                </div>

                 {org?.role === 'admin' && (
                <div className="flex items-center gap-2">
                 
                    
                   <button
                   onClick={(e) => {
                     e.stopPropagation();
                     setSelectedOrg(org);
                     setShowInviteModal(true);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 border border-border text-xs font-medium hover:bg-surface transition"
                    >
                    <UserPlusIcon size={16} />
                    Add
                  </button>
                  <button
                  onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setSelectedOrg(org);
                      setShowSettingsModal(true);
                    }}
                    className="p-2 hover:bg-surface border border-transparent hover:border-border transition"
                  >
                    <GearIcon size={18} className="text-text-secondary" />
                  </button>
                
                </div>
              )}
              </div>
            </div>
          ))
        )}
        <CreateOrgModal
          isOpen={showCreateOrgModal}
          onClose={() => setShowCreateOrgModal(false)}
            setOrgs={setOrgs}
        />
        <InviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          orgId={selectedOrg?.id}
        />       
        <OrgSettingsModal
          isOpen={showSettingsModal}
          onClose={() => {
            setShowSettingsModal(false);
            setSelectedOrg(null);          
          }}
          setOrgs={setOrgs}
          organization={selectedOrg}
        />
      </div>
    </div>
  );
};

export default OrganizationsTab;