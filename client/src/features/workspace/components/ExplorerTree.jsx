import { useState, memo, useCallback } from "react";
import { CaretRight, CaretDown, Folder, FileText, CircleNotch, PencilSimple, Trash } from "@phosphor-icons/react";
import { useWorkspace } from "../context/WorkspaceContext";

const ExplorerTree = memo(({ itemId, onSelect, selectedId, level = 0, parentId = null }) => {
  const { nodes, expandFolder, renameNode, deleteNode } = useWorkspace();
  const item = nodes[itemId];  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!item) return null;

  const isSelected = selectedId === itemId;
  const isFolder = 'hasChildren' in item

  const handleToggle = useCallback(async (e) => {
    e.stopPropagation();
    onSelect(itemId, !!isFolder);
    if (!isFolder) return;

    const nextOpenState = !isOpen;
    setIsOpen(nextOpenState);
    if (nextOpenState && !item.loaded) {
      setIsLoading(true);
      try {
        await expandFolder(itemId);
      } catch (err) {
        console.error("Failed to expand folder", err);
       } finally {
        setIsLoading(false);
      }
    }
  }, [itemId, item?.loaded, isFolder, isOpen, onSelect, expandFolder]);

  const handleRename = (e) => {
    e.stopPropagation();
    const currentName = item.name || item.title;
    const newName = window.prompt("Enter new name:", currentName);
    if (newName && newName !== currentName) {
      renameNode(itemId, newName, isFolder, parentId);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete ${isFolder ? "folder" : "document"} "${item.name || item.title}"?`)) {
      deleteNode(itemId, isFolder, parentId);
    }
  };

  return (
    <div className="w-full select-none group/tree-item">
      <div
        onClick={handleToggle}
        className={`group flex items-center gap-2 py-1 px-2 cursor-pointer text-sm rounded-sm mb-px transition-colors
          ${isSelected ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-slate-700"}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <span className="w-4 flex justify-center">
          {isLoading ? (
            <CircleNotch size={12} className="animate-spin" />
          ) : isFolder ? (
            isOpen ? <CaretDown size={12} /> : <CaretRight size={12} />
          ) : (
            <FileText size={14} />
          )}
        </span>
        {isFolder && <Folder size={14} weight={isOpen ? "fill" : "regular"} />}
        <span className="truncate flex-1">{item.name || item.title}</span>

        <div className="hidden group-hover/tree-item:flex items-center gap-1 opacity-60">
          <button onClick={handleRename} className="p-1 rounded hover:bg-gray-300/50" title="Rename">
            <PencilSimple size={12} />
          </button>
          <button onClick={handleDelete} className="p-1 rounded hover:bg-red-500 hover:text-white" title="Delete">
            <Trash size={12} />
          </button>
        </div>
      </div>

      {isFolder && isOpen && (
        <div className="flex flex-col">
          {item.subfolders?.map((subId) => (
            <ExplorerTree
              key={subId}
              itemId={subId}
              parentId={itemId}
              selectedId={selectedId}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
          {item.documents?.map((doc) => (
            <div
              key={doc.id}
              onClick={(e) => { e.stopPropagation(); onSelect(doc.id, false); }}
              className={`group/doc flex items-center gap-2 py-1 px-2 cursor-pointer text-sm rounded-sm mb-px transition-colors
                ${selectedId === doc.id ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-slate-700"}`}
              style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
            >
              <span className="w-4 flex justify-center"><FileText size={14} /></span>
              <span className="truncate flex-1">{doc.title}</span>
              <div className="hidden group-hover/doc:flex items-center gap-1 opacity-60">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    const n = window.prompt("New name:", doc.title);
                    if(n) renameNode(doc.id, n, false, itemId); 
                  }} 
                  className="p-1 rounded hover:bg-gray-300/50"
                >
                  <PencilSimple size={12} />
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if(window.confirm("Delete document?")) deleteNode(doc.id, false, itemId); 
                  }} 
                  className="p-1 rounded hover:bg-red-500 hover:text-white"
                >
                  <Trash size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default ExplorerTree;