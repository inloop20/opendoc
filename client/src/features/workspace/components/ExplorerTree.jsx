import { useState } from 'react';
import { CaretRight, CaretDown, Folder, FileText, CircleNotch } from "@phosphor-icons/react";

const ExplorerTree = ({ item, onSelect, selectedId, level = 0, onExpandFolder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!item) return null;

  const isSelected = selectedId === item.id;
  const isFolder = 'hasChildren' in item

  const handleToggle = async (e) => {
    e.stopPropagation();
    onSelect(item.id, isFolder);
    
    if (isFolder) {
      if (!isOpen && item.hasChildren && (!item.subfolders || item.subfolders.length === 0)) {
        setIsLoading(true);
        await onExpandFolder(item.id);
        setIsLoading(false);
      }
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="w-full select-none">
      <div 
        onClick={handleToggle}
        className={`group flex items-center gap-2 py-1 px-2 cursor-pointer transition-colors text-sm rounded-sm mb-px
          ${isSelected ? "bg-primary text-white" : "text-text-primary hover:bg-surfaceHover"}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <span className="shrink-0 w-4 flex items-center justify-center">
          {isLoading ? (
            <CircleNotch size={12} className="animate-spin" />
          ) : isFolder ? (
            isOpen ? <CaretDown size={12} weight="bold" /> : <CaretRight size={12} weight="bold" />
          ) : (
            <FileText size={16} />
          )}
        </span>
        
        {isFolder && (
          <Folder 
            size={16} 
            weight={isOpen ? "fill" : "regular"} 
            className={isSelected ? "text-white" : "text-primary"} 
          />
        )}
        
        <span className="truncate flex-1 font-medium">{item.name || item.title}</span>
      </div>

      {isOpen && (
        <div className="relative">
          {isFolder && !isLoading && item.subfolders?.length === 0 && item.documents?.length === 0 && (
            <div 
              className="py-1 px-2 text-[11px] text-text-tertiary italic"
              style={{ paddingLeft: `${(level + 1) * 12 + 28}px` }}
            >
              Empty folder
            </div>
          )}

          {item.subfolders?.map((sub) => (
            <ExplorerTree 
              key={sub.id} 
              item={sub} 
              selectedId={selectedId}
              onSelect={onSelect} 
              onExpandFolder={onExpandFolder}
              level={level + 1} 
            />
          ))}
          {item.documents?.map((doc) => (
            <ExplorerTree 
              key={doc.id} 
              item={doc} 
              selectedId={selectedId}
              onSelect={onSelect} 
              onExpandFolder={onExpandFolder}
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorerTree;