import React, { useState } from "react";
import { DotsThreeVertical } from "@phosphor-icons/react";

const MemberRow = React.memo(({
  member,
  isAdmin,
  isSelf,
  onChangeRole,
  onRemove
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-4 px-4 py-4 relative hover:bg-surface-secondary/20">

      <div className="w-11 h-11 rounded-full bg-[#dfe5e7] flex items-center justify-center font-bold text-text-secondary">
        {member.user.username?.[0]?.toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold flex items-center gap-2">
          {member.user.username}

          {isSelf && (
            <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm font-bold">
              YOU
            </span>
          )}
        </p>

        <p className="text-[12px] text-text-secondary capitalize">
          {member.role}
        </p>
      </div>

      {isAdmin && !isSelf && (
        <div className="relative">

          <button
            onClick={() => setOpen((p) => !p)}
            className="p-2 hover:bg-surface-secondary rounded-full"
          >
            <DotsThreeVertical size={18} />
          </button>

          {open && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-border shadow-md z-30">

              <button
                onClick={() =>
                  onChangeRole(
                    member.userId,
                    member.role === "admin" ? "member" : "admin"
                  )
                }
                className="w-full px-3 py-2 text-xs font-bold hover:bg-surface-secondary text-left"
              >
                Toggle Role
              </button>

              <button
                onClick={() => onRemove(member.userId)}
                className="w-full px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 text-left"
              >
                Remove
              </button>

            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default MemberRow;