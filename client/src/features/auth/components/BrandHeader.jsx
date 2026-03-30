import { FileIcon } from '@phosphor-icons/react';

const BrandHeader = () => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-primary flex items-center justify-center">
        <FileIcon size={24} weight="fill" className="text-white" />
      </div>
      <h1 className="text-3xl font-black tracking-tighter text-text-primary font-heading">
        OpenDoc
      </h1>
    </div>
    <p className="text-sm text-text-secondary font-body">
      Collaborative document management for modern teams
    </p>
  </div>
);

export default BrandHeader;