import { useEffect, useState } from "react";
import { FolderPlus, FilePlus, Gear } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/ui/Sidebar.jsx";
import ErrorBanner from "../../../components/ui/ErrorBanner.jsx"; 
import ExplorerTree from "./ExplorerTree";
import CreateDocumentModal from "./CreateDocumentModal";
import CreateFolderModal from "./CreateFolderModal";
import { useWorkspace } from "../context/WorkspaceContext";

const WorkspaceSidebar = ({ workspace, onSelectDocument }) => {
  const { nodes, rootIds, loadExplorer, addFolder, addDocument, error, clearError } = useWorkspace();

  const [selectedId, setSelectedId] = useState(null);
  const [lastSelectedFolderId, setLastSelectedFolderId] = useState(null);
  const [docModal, setDocModal] = useState(false);
  const [folderModal, setFolderModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (workspace?.id) loadExplorer(workspace.id);
  }, [workspace?.id, loadExplorer]);

  const handleSelect = (id, isFolder) => {
    setSelectedId(id);
    if (isFolder) {
      setLastSelectedFolderId(id);
    } else if (onSelectDocument) {
      const doc = nodes[id];
      onSelectDocument(id, [doc?.title || doc?.name]);
    }
  };
  
  return (
    <Sidebar headerTitle={workspace?.name} memberCount={workspace?.counts?.workspace_member}>
      {error && (
        <div className="px-2 pt-2">
          <ErrorBanner message={error} onClose={clearError} />
        </div>
      )}

      <div className="border-b border-gray-200 px-3 py-2">
        <button
          onClick={() => navigate(`/workspace/${workspace?.id}/settings`)}
          className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition group"
        >
          <Gear size={16} className="transition-transform group-hover:rotate-45" />
          <span className="font-medium">Workspace Settings</span>
        </button>
      </div>

      <div className="flex items-center justify-between px-4 py-3 mt-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Explorer</p>
        <div className="flex gap-1">
          <button onClick={(e) => { e.stopPropagation(); setFolderModal(true); }} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="New Folder">
            <FolderPlus size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setDocModal(true); }} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="New Document">
            <FilePlus size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4" onClick={() => { setSelectedId(null); setLastSelectedFolderId(null); }}>
        {rootIds.length === 0 ? (
          <div className="text-xs text-gray-400 px-3 py-2 italic">No folders yet</div>
        ) : (
          rootIds.map((id) => (
            <ExplorerTree key={id} itemId={id} parentId={null} selectedId={selectedId} onSelect={handleSelect} />
          ))
        )}
      </div>

      {folderModal && (
        <CreateFolderModal
          workspaceId={workspace?.id}
          parentId={lastSelectedFolderId}
          onClose={() => setFolderModal(false)}
          onSuccess={(folder) => { addFolder(folder, lastSelectedFolderId); setFolderModal(false); }}
        />
      )}

      {docModal && (
        <CreateDocumentModal
          workspaceId={workspace?.id}
          parentId={lastSelectedFolderId}
          onClose={() => setDocModal(false)}
          onSuccess={(doc) => { addDocument(doc, lastSelectedFolderId); setDocModal(false); }}
        />
      )}
    </Sidebar>
  );
};

export default WorkspaceSidebar;