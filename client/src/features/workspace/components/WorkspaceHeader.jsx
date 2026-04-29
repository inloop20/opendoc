import { MagnifyingGlass, CaretRight } from "@phosphor-icons/react";

const WorkspaceHeader = ({ path = [], searchQuery, onSearchChange }) => {
  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-white shrink-0">
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="flex items-center text-sm font-medium text-text-secondary whitespace-nowrap">
          {path.length === 0 && <span className="text-text-tertiary">Select a document</span>}
          
          {path.map((name, index) => (
            <div key={index} className="flex items-center">
              <span 
                className={`transition-colors cursor-default ${
                  index === path.length - 1 
                    ? "text-text-primary font-bold" 
                    : "hover:text-primary"
                }`}
              >
                {name}
              </span>
              {index < path.length - 1 && (
                <CaretRight size={12} className="mx-2 text-borderStrong" weight="bold" />
              )}
            </div>
          ))}
        </div>
      </div>
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