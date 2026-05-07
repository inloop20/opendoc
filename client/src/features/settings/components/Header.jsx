import { ArrowLeft } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import React from "react";

const Header = React.memo(({ name, membersCount }) => {
  const navigate = useNavigate();

  return (
    <div className="h-16 flex items-center gap-4 px-4 border-b">
      <button onClick={() => navigate(-1)}>
        <ArrowLeft />
      </button>

      <div>
        <div className="font-bold">Settings</div>
        <div className="text-xs text-gray-500">
          {name} • {membersCount} members
        </div>
      </div>
    </div>
  );
});

export default Header;