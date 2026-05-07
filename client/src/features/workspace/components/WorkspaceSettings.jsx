import React, { useEffect, useContext, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/context/AuthContext";
import { useWorkspace } from "../context/WorkspaceContext";

import Header from "../../settings/components/Header";
import ProfileCard from "../../settings/components/ProfileCard";
import MembersList from "../../settings/components/MembersList";
import InviteMemberModal from "../../settings/components/InviteMemberModal";
import ConfirmationModal from "../../../components/ConfirmationModal";

import workspaceApi from "../services/workspaceApi";
import { Trash, SignOut } from "@phosphor-icons/react";

const WorkspaceSettings = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const {
    workspace,
    members,
    loadMembers,
    updateWorkspaceName,
    setMembers,
    updateMemberRole
  } = useWorkspace();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (workspaceId) {
      loadMembers(workspaceId);
    }
  }, [workspaceId, loadMembers]);

  const isAdmin = workspace?.role === "admin";

  const handleUpdateName = useCallback(
    async (name) => {
      await updateWorkspaceName(workspaceId, name);
    },
    [workspaceId, updateWorkspaceName]
  );

  const handleInvite = async (email) => {
    const res = await workspaceApi.addMember(workspaceId, email);
    const newMember = {
      ...res.data,
      userId: res.data.user.id || res.data.user.id
    };
    
    setMembers((prev) => [...prev, newMember]);
    setInviteOpen(false);
  };

  const handleRoleChange = async (userId, role) => {
    if(!userId) {
      console.log(userId);
      return;
      
    }
    
    await updateMemberRole(workspaceId, userId, role);

    setMembers((prev) =>
      prev.map((m) =>
        m.userId === userId ? { ...m, role } : m
      )
    );
  };

  const handleRemove = (userId) => {
    setModal({ isOpen: true, type: "kick", data: userId });
  };

  const onDelete = () => {
    setModal({ isOpen: true, type: "delete", data: null });
  };

  const onLeave = () => {
    setModal({ isOpen: true, type: "leave", data: null });
  };

  const handleConfirm = async () => {
    setLoading(true);

    try {
      if (modal.type === "kick") {
        await workspaceApi.removeMember(workspaceId, modal.data);

        setMembers((prev) =>
          prev.filter((m) => m.userId !== modal.data)
        );
      }

      if (modal.type === "delete") {
        await workspaceApi.deleteWorkspace(workspaceId);
        navigate("/dashboard");
      }

      if (modal.type === "leave") {
        await workspaceApi.leaveWorkspace(workspaceId);
        navigate("/dashboard");
      }

      setModal({ isOpen: false, type: null, data: null });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!workspace || !user) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">

      <Header
        name={workspace?.name}
        membersCount={members?.length || 0}
      />

      <div className="flex-1 overflow-y-auto bg-[#f0f2f5]">
        <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">

          <ProfileCard
            name={workspace?.name}
            isAdmin={isAdmin}
            onUpdateName={handleUpdateName}
          />

          <MembersList
            members={members || []}
            currentUserId={user.user.id}
            isAdmin={isAdmin}
            onChangeRole={handleRoleChange}
            onRemove={handleRemove}
            onInvite={() => setInviteOpen(true)}
          />

          <div className="bg-white shadow-sm border border-border/50 overflow-hidden mt-3">

            {isAdmin ? (
              <button
                onClick={onDelete}
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-red-50"
              >
                <Trash size={20} className="text-red-500" />
                <div>
                  <p className="text-sm font-bold text-red-600">
                    Delete Workspace
                  </p>
                  <p className="text-xs text-text-secondary">
                    Permanently remove workspace
                  </p>
                </div>
              </button>
            ) : (
              <button
                onClick={onLeave}
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-red-50"
              >
                <SignOut size={20} className="text-red-500" />
                <div>
                  <p className="text-sm font-bold text-red-600">
                    Leave Workspace
                  </p>
                  <p className="text-xs text-text-secondary">
                    You will lose access
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
          onSubmit={handleInvite}
        />
      )}

      <ConfirmationModal
        isOpen={modal.isOpen}
        isLoading={loading}
        variant="danger"
        onClose={() => setModal({ isOpen: false })}
        onConfirm={handleConfirm}
        confirmText={
          modal.type === "kick"
            ? "Remove Member"
            : modal.type === "delete"
            ? "Delete Workspace"
            : "Leave Workspace"
        }
        message="This action cannot be undone."
      />

    </div>
  );
};

export default WorkspaceSettings;