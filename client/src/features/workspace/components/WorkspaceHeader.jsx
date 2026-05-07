import { MagnifyingGlass, CaretRight } from "@phosphor-icons/react";

const WorkspaceHeader = ({searchQuery, onSearchChange }) => {
  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-white shrink-0">
      <div className="flex-1 max-w-md ml-8">
        <div className="relative group">
          <MagnifyingGlass 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" 
          />
          <input
            type="text"
            placeholder="Search in this workspace..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>
    </header>
  );
};

export default WorkspaceHeader;