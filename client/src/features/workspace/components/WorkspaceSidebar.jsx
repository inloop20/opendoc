import { House, Folder, FolderPlus } from "@phosphor-icons/react";
import Sidebar from "../../../components/ui/Sidebar.jsx";

const WorkspaceSidebar = ({
  workspace,
  folders,
  selectedFolder,
  onSelectFolder,
  onCreateFolderClick,
}) => {
  return (
    <Sidebar
      headerLabel={"Workspace"}
      headerTitle={workspace.name}
      headerSubtitle={workspace.org}
      memberCount={32}
    >
      <div className="p-2">
        <button
          onClick={() => onSelectFolder(null)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-150 ${
            !selectedFolder
              ? "bg-text-primary text-white"
              : "text-text-primary hover:bg-surfaceHover"
          }`}
        >
          <House size={16} />
          All Documents
        </button>
      </div>
      <div className="p-2">
        <div className="flex items-center justify-between px-3 py-2 mb-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary">
            Folders
          </p>
          <button
            onClick={onCreateFolderClick}
            className="hover:bg-surfaceHover p-1 transition-colors duration-150"
          >
            <FolderPlus size={14} className="text-text-secondary" />
          </button>
        </div>

        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onSelectFolder(folder.id)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm mb-1 transition-colors duration-150 ${
              selectedFolder === folder.id
                ? "bg-text-primary text-white"
                : "text-text-primary hover:bg-surfaceHover"
            }`}
          >
            <div className="flex items-center gap-2">
              <Folder size={16} />
              <span className="truncate">{folder.name}</span>
            </div>
            <span className="text-xs opacity-70">{folder.documents}</span>
          </button>
        ))}
      </div>
    </Sidebar>
  );
};

export default WorkspaceSidebar;
