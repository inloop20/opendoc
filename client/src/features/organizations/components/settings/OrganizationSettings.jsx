import React, { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orgWorkspaceApi } from "../../services/orgWorkspaceApi";
import { orgApi } from "../../services/orgApi";
import { AuthContext } from "../../../auth/context/AuthContext";
import { useOrgPermissions } from "../../hooks/useOrgPermission";

import OrganizationHeader from "./OrganizationHeader";
import OrganizationProfileCard from "./OrganizationProfileCard";
import MembersList from "./MembersList";
import InviteMemberModal from "./InviteMemberModal";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import { SignOutIcon, TrashIcon } from "@phosphor-icons/react";

export const OrganizationSettings = () => {
  const { orgId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate()
  const { permissions } = useOrgPermissions(orgId);

  const [organization, setOrganization] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [modal, setModal] = useState({ isOpen: false });

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);

      const [orgRes, memRes] = await Promise.all([
        orgWorkspaceApi.getOrgById(orgId),
        orgWorkspaceApi.getOrgMembers(orgId),
      ]);

      if (!ignore) {
        setOrganization(orgRes.data);
        setMembers(memRes.data);
        setLoading(false);
      }
    };

    load();
    return () => (ignore = true);
  }, [orgId]);

  const updateName = useCallback(async (name) => {
    await orgApi.updateOrg(orgId, name);
    setOrganization((p) => ({ ...p, name }));
  }, [orgId]);

  const inviteMember = useCallback(async (email) => {
    await orgApi.addUsers(orgId, email);
    setInviteOpen(false);
  }, [orgId]);

  const changeRole = useCallback((userId, role) => {
    orgApi.updateMemberRole(orgId, userId, role);

    setMembers((prev) =>
      prev.map((m) =>
        m.userId === userId ? { ...m, role } : m
      )
    );
  }, [orgId]);

  const removeMember = useCallback((userId) => {
    setModal({ isOpen: true, type: "kick", data: userId });
  }, []);

  const handleConfirmedAction = async () => {
  setLoading(true);

  try {
    if (modal.type === "kick") {
      await orgApi.removeMember(orgId, modal.data);

      setMembers((prev) =>
        prev.filter((m) => m.userId !== modal.data)
      );
    }

    if (modal.type === "delete") {
      await orgApi.deleteOrg(orgId);
      navigate("/dashboard");
    }

    if (modal.type === "leave") {
      await orgApi.leaveOrganization(orgId);
      navigate("/dashboard");
    }

    setModal({ isOpen: false, type: null, data: null });

  } catch (err) {
   console.log(err);
   
  } finally {
    setLoading(false);
  }
};

  const onDelete = ()=>{
    setModal({isOpen:true,type:'delete',data:null})
  }

  const onLeave = ()=>{
      setModal({isOpen:true,type:'leave',data:null})
  }

  const isAdmin = permissions?.canManageOrg;

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="h-full flex flex-col">

      <OrganizationHeader
        organization={organization}
        membersCount={members.length}
      />

      <div className="flex-1 overflow-y-auto bg-[#f0f2f5]">
        <div className="max-w-2xl mx-auto py-6 px-4">

          <OrganizationProfileCard
            organization={organization}
            isAdmin={isAdmin}
            onUpdateName={updateName}
          />

          <MembersList
            members={members}
            currentUserId={user?.user?.id}
            isAdmin={isAdmin}
            onChangeRole={changeRole}
            onRemove={removeMember}
            onInvite={() => setInviteOpen(true)}
          />

       <div className="bg-white shadow-sm border border-border/50 overflow-hidden mt-3">

    
      {isAdmin && (
        <button
          onClick={onDelete}
          className="w-full flex items-center gap-4 px-4 py-4 hover:bg-red-50 group transition-colors"
        >
          <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
            <TrashIcon size={20} weight="bold" />
          </div>

          <div className="flex-1">
            <p className="text-[14px] font-bold text-red-600">
              Delete Organization
            </p>
            <p className="text-[11px] text-text-secondary">
              Permanently remove this organization and all its data
            </p>
          </div>
        </button>
      )}

      {!isAdmin && (
        <button
          onClick={onLeave}
          className="w-full flex items-center gap-4 px-4 py-4 hover:bg-red-50 group transition-colors"
        >
          <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
            <SignOutIcon size={20} weight="bold" />
          </div>

          <div className="flex-1">
            <p className="text-[14px] font-bold text-red-600">
              Leave Organization
            </p>
            <p className="text-[11px] text-text-secondary">
              You will lose access to all workspaces and documents
            </p>
          </div>
        </button>
      )}

    </div>

        </div>
      </div>

      {inviteOpen && (
        <InviteMemberModal
          onClose={() => setInviteOpen(false)}
          onSubmit={inviteMember}
        />
      )}

      <ConfirmationModal
        isOpen={modal.isOpen}
  isLoading={loading}
  variant="danger"
  onConfirm={
    modal.type === "kick"
      ? "Remove Member"
      : modal.type === "delete"
      ? "Delete Organization"
      : "Leave Organization"
  }
  message={
    modal.type === "kick"
      ? "This member will lose access immediately."
      : "This action cannot be undone."
  }
  onClose={() => setModal({ isOpen: false, type: null, data: null })}
  onConfirm={handleConfirmedAction}

      />
    </div>
  );
};

export default OrganizationSettings;