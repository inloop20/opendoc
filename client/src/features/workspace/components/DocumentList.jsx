import { File } from '@phosphor-icons/react';
import DocumentItem from './DocumentItem';

const DocumentList = ({ documents, selectedFolder, onCreateDoc }) => {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-4">
        {selectedFolder ? 'Documents in this folder' : 'Recent Documents'}
      </h3>
      <div className="border border-border">
        {documents.length > 0 ? (
          documents.map((doc, index) => (
            <DocumentItem 
              key={doc.id} 
              doc={doc} 
              isLast={index === documents.length - 1} 
            />
          ))
        ) : (
          <div className="p-12 text-center">
            <File size={48} className="text-text-secondary mx-auto mb-4" />
            <p className="text-sm text-text-secondary">No documents in this folder</p>
            <button
              onClick={onCreateDoc}
              className="mt-4 text-sm text-primary hover:text-primary-hover font-semibold"
            >
              Create your first document
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;