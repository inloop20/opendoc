import { useState, useEffect } from 'react';
import { FolderPlus, FilePlus, Plus } from "@phosphor-icons/react";
import workspaceApi from '../services/workspaceApi';
import Sidebar from "../../../components/ui/Sidebar.jsx";
import ExplorerTree from "./ExplorerTree";
import CreateDocumentModal from "./CreateDocumentModal";
import CreateFolderModal from "./CreateFolderModal";

const WorkspaceSidebar = ({ workspace, onSelectDocument, onReset }) => {
  const [folders, setFolders] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  
  const [showDocModal, setShowDocModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);

  const loadExplorer = async () => {
    if (!workspace?.id) return;
    try {
      const response = await workspaceApi.getFolders(workspace.id);
      setFolders(response.data || []);
    } catch (err) {
      console.error("Explorer sync failed:", err);
    }
  };

  useEffect(() => {
    loadExplorer();
  }, [workspace?.id]);

  const handleExpandFolder = async (folderId) => {
    try {
      const response = await workspaceApi.getFolderContent(folderId);
      const data = response.data;

      const updateRecursive = (list) => list.map(node => {
        if (node.id === folderId) {
          return { 
            ...node, 
            subfolders: data.subfolders || [], 
            documents: data.documents || [] 
          };
        }
        if (node.subfolders) {
          return { ...node, subfolders: updateRecursive(node.subfolders) };
        }
        return node;
      });

      setFolders(prev => updateRecursive(prev));
    } catch (err) {
      console.error("Folder expansion failed:", err);
    }
  };

  const findPathNames = (nodes, targetId, currentPath = []) => {
    for (const node of nodes) {
      const name = node.name || node.title;
      const newPath = [...currentPath, name];
      if (node.id === targetId) return newPath;
      
      const children = [...(node.subfolders || []), ...(node.documents || [])];
      const found = findPathNames(children, targetId, newPath);
      if (found) return found;
    }
    return null;
  };

  const handleSelect = (id, isFolder) => {
    setSelectedId(id);
    if (!isFolder) {
      const path = findPathNames(folders, id);
      onSelectDocument(id, path || []);
    }
  };

  return (
    <Sidebar 
      headerTitle={workspace?.name} 
      memberCount={workspace?._count?.workspace_member}
    >
      <div className="flex flex-col h-full" onClick={onReset}>
        <div className="flex items-center justify-between px-4 py-2 mt-4 mb-1" onClick={(e) => e.stopPropagation()}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">Explorer</p>
        
          <div className="flex gap-1">
            <button 
              onClick={() => setShowFolderModal(true)}
              className="p-1 hover:bg-surfaceHover text-text-secondary rounded transition-colors"
              title="New Folder"
            >
              <FolderPlus size={14} />
            </button>
            <button 
              onClick={() => setShowDocModal(true)}
              className="p-1 hover:bg-surfaceHover text-text-secondary rounded transition-colors"
              title="New Document"
            >
              <FilePlus size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pt-1" onClick={(e) => e.stopPropagation()}>
          { 
            folders.map(folder => (
              <ExplorerTree 
                key={folder.id} 
                item={folder} 
                selectedId={selectedId}
                onSelect={handleSelect}
                onExpandFolder={handleExpandFolder}
              />
            ))
          }
        </div>
        <div className="h-10 shrink-0" />
      </div>

    
      
      {showFolderModal && (
        <CreateFolderModal 
          workspaceId={workspace.id}
          parentId={selectedId} 
          onClose={() => setShowFolderModal(false)}
          onSuccess={() => {
            loadExplorer(); 
            setShowFolderModal(false);
          }}
        />
      )}

      {showDocModal && (
        <CreateDocumentModal 
          workspaceId={workspace.id}
          parentId={selectedId} 
          onClose={() => setShowDocModal(false)}
          onSuccess={() => {
            loadExplorer();
            setShowDocModal(false);
          }}
        />
      )}
    </Sidebar>
  );
};

export default WorkspaceSidebar;