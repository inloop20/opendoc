import React from "react";
import MemberRow from "./MemberRow";

const MembersList = React.memo(({
  members,
  currentUserId,
  isAdmin,
  onChangeRole,
  onRemove,
  onInvite
}) => {
  return (
    <div className="bg-white mb-3 shadow-sm border border-border/50">

      {/* HEADER */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-border/40">
        <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-primary">
          Members
        </span>

        {isAdmin && (
          <button
            onClick={onInvite}
            className="text-primary text-sm font-medium hover:opacity-80"
          >
            + Invite
          </button>
        )}
      </div>

      {/* LIST */}
      <div className="divide-y divide-border/30">
        {members.map((m) => (
          <MemberRow
            key={m.userId}
            member={m}
            isAdmin={isAdmin}
            isSelf={m.userId === currentUserId}
            onChangeRole={onChangeRole}
            onRemove={onRemove}
          />
        ))}
      </div>

    </div>
  );
});

export default MembersList;