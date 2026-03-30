import { useState } from 'react';
import { useParams } from 'react-router';


import WorkspaceSidebar from '../features/workspace/components/WorkspaceSidebar';
import WorkspaceHeader from '../features/workspace/components/WorkspaceHeader';
import FolderGrid from '../features/workspace/components/FolderGrid';
import DocumentList from '../features/workspace/components/DocumentList';
import CreateFolderModal from '../features/workspace/components/CreateFolderModal';
import CreateDocumentModal from '../features/workspace/components/CreateDocumentModal';

const WorkspacePage = ({ onLogout }) => {
  const { workspaceId } = useParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showCreateDocModal, setShowCreateDocModal] = useState(false);

  const workspace = { 
    id: workspaceId, 
    name: 'Product Documentation', 
    org: 'Acme Corp' 
  };

  const folders = [
    { id: 1, name: 'Getting Started', documents: 8, updatedAt: '2 hours ago' },
    { id: 2, name: 'API Reference', documents: 15, updatedAt: '1 day ago' },
    { id: 3, name: 'Tutorials', documents: 12, updatedAt: '3 hours ago' },
    { id: 4, name: 'Release Notes', documents: 24, updatedAt: '5 hours ago' }
  ];

  const documents = [
    { id: 1, name: 'Introduction to OpenDoc', folderId: 1, updatedAt: '1 hour ago', author: 'John Doe' },
    { id: 2, name: 'Installation Guide', folderId: 1, updatedAt: '2 hours ago', author: 'Jane Smith' },
    { id: 3, name: 'Quick Start Tutorial', folderId: 1, updatedAt: '3 hours ago', author: 'John Doe' }
  ];

  // Derived State
  const displayedDocuments = selectedFolder
    ? documents.filter(doc => doc.folderId === selectedFolder)
    : documents;

  return (
    <div className="min-h-screen bg-white flex">
      {/* 1. Sidebar */}
      <WorkspaceSidebar 
        workspace={workspace}
        folders={folders}
        selectedFolder={selectedFolder}
        onSelectFolder={setSelectedFolder}
        onCreateFolderClick={() => setShowCreateFolderModal(true)}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col">
        {/* 2. Header */}
        <WorkspaceHeader 
          workspace={workspace}
          folders={folders}
          selectedFolder={selectedFolder}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateFolder={() => setShowCreateFolderModal(true)}
          onCreateDoc={() => setShowCreateDocModal(true)}
        />

        {/* 3. Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {!selectedFolder && (
            <FolderGrid 
              folders={folders} 
              onSelectFolder={setSelectedFolder} 
            />
          )}

          <DocumentList 
            documents={displayedDocuments} 
            selectedFolder={selectedFolder}
            onCreateDoc={() => setShowCreateDocModal(true)}
          />
        </main>
      </div>

      {/* 4. Feature Modals */}
      {showCreateFolderModal && (
        <CreateFolderModal onClose={() => setShowCreateFolderModal(false)} />
      )}
      {showCreateDocModal && (
        <CreateDocumentModal 
          folders={folders} 
          onClose={() => setShowCreateDocModal(false)} 
        />
      )}
    </div>
  );
};

export default WorkspacePage;