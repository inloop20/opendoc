import { createContext, useContext, useState, useCallback } from "react";
import workspaceApi from "../services/workspaceApi";

const WorkspaceContext = createContext(null);

export const WorkspaceProvider = ({ children }) => {
  const [workspace, setWorkspace] = useState(null);
  const [nodes, setNodes] = useState({}); 
  const [rootIds, setRootIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);

  const clearError = () => setError(null);

  const isNameDuplicate = (newName, parentId) => {
  const searchName = newName.trim().toLowerCase();
  if (parentId && nodes[parentId]) {
    const parentName = nodes[parentId].name?.toLowerCase();
    if (parentName === searchName) return true;
  } 
 
  else if (!parentId && workspace?.name?.toLowerCase() === searchName) {
    return true;
  }

  const folderSiblingIds = parentId ? nodes[parentId]?.subfolders || [] : rootIds;
  const documentSiblings = parentId ? nodes[parentId]?.documents || [] : [];

  const folderMatch = folderSiblingIds.some(
    (id) => nodes[id]?.name?.toLowerCase() === searchName
  );
  
  const docMatch = documentSiblings.some(
    (doc) => (doc.title || doc.name)?.toLowerCase() === searchName
  );

  return folderMatch || docMatch;
};

  const loadWorkspace = useCallback(async (workspaceId) => {
    if (!workspaceId) return;
    setLoading(true);
    try {
      const res = await workspaceApi.getWorkspace(workspaceId);
      setWorkspace(res.data);
    } catch (err) {
      setError("Failed to load workspace data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMembers = useCallback(async (workspaceId) => {
    try {
      const res = await workspaceApi.getMembers(workspaceId);
      setMembers(res.data);
    } catch (err) {
      setError("Failed to load members.");
    }
  }, []);

  const updateWorkspaceName = useCallback(async (workspaceId, name) => {
    try {
      clearError();
      const res = await workspaceApi.updateWorkspace(workspaceId, { name });
      setWorkspace(prev => ({ ...prev, name: res.data.name }));
      return true;
    } catch (err) {
      setError("Failed to update workspace name.");
      return false;
    }
  }, []);

  const updateMemberRole = useCallback(async (workspaceId, userId, role) => {
    try {
      await workspaceApi.updateMemberRole(workspaceId, userId, role);
    } catch (err) {
      setError("Failed to update member role.");
    }
  }, []);

  const loadExplorer = useCallback(async (workspaceId) => {
    setLoading(true);
    clearError();
    try {
      const res = await workspaceApi.getFolders(workspaceId);
      const initialNodes = {};
      const initialRootIds = [];

      res.data.forEach((folder) => {
        initialRootIds.push(folder.id);
        initialNodes[folder.id] = {
          ...folder,
          subfolders: folder.subfolders?.map((f) => f.id) || [],
          documents: folder.documents || [],
          loaded: false,
        };
      });

      setNodes(initialNodes);
      setRootIds(initialRootIds);
    } catch (err) {
      setError("Failed to load file explorer.");
    } finally {
      setLoading(false);
    }
  }, []);

  const expandFolder = useCallback(async (folderId) => {
    if (nodes[folderId]?.loaded) return;
    try {
      const res = await workspaceApi.getFolderContent(folderId);
      const { subfolders, documents } = res.data;

      setNodes((prev) => {
        const newNodes = { ...prev };
        newNodes[folderId] = {
          ...prev[folderId],
          subfolders: subfolders.map((f) => f.id),
          documents: documents,
          loaded: true,
        };
        subfolders.forEach((sub) => {
          newNodes[sub.id] = {
            ...sub,
            subfolders: sub.subfolders?.map((f) => f.id) || [],
            documents: sub.documents || [],
            loaded: false,
          };
        });
        return newNodes;
      });
    } catch (err) {
      setError("Could not expand folder.");
    }
  }, [nodes]);

  const addFolder = useCallback((folder, parentId = null) => {
    if (isNameDuplicate(folder.name, parentId, true)) {
      setError("A folder with this name already exists.");
      return;
    }
    const newFolder = { ...folder, subfolders: [], documents: [], loaded: true };
    setNodes((prev) => ({
      ...prev,
      [folder.id]: newFolder,
      ...(parentId && {
        [parentId]: {
          ...prev[parentId],
          subfolders: [...prev[parentId].subfolders, folder.id],
        },
      }),
    }));
    if (!parentId) setRootIds((prev) => [...prev, folder.id]);
  }, [nodes, rootIds]);

  const addDocument = useCallback((doc, parentId) => {
    if (isNameDuplicate(doc.title, parentId, false)) {
      setError("A document with this name already exists.");
      return;
    }
    setNodes((prev) => ({
      ...prev,
      [parentId]: {
        ...prev[parentId],
        documents: [...(prev[parentId].documents || []), doc],
      },
    }));
  }, [nodes]);

  const renameNode = useCallback(async (id, newName, isFolder, parentId) => {
    if (isNameDuplicate(newName, parentId, isFolder)) {
      setError(`Another ${isFolder ? "folder" : "document"} already has this name.`);
      return;
    }
    try {
      clearError();
      if (isFolder) await workspaceApi.updateFolder(id, { name: newName });
      else await workspaceApi.updateDocument(id, { title: newName });

      setNodes((prev) => ({
        ...prev,
        [id]: { ...prev[id], [isFolder ? "name" : "title"]: newName },
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Rename failed.");
    }
  }, [nodes, rootIds]);

  const deleteNode = useCallback(async (id, isFolder, parentId = null) => {
    try {
      clearError();
      if (isFolder) await workspaceApi.deleteFolder(id);
      else await workspaceApi.deleteDocument(id);

      setNodes((prev) => {
        const newNodes = { ...prev };
        delete newNodes[id];
        if (parentId && newNodes[parentId]) {
          if (isFolder) newNodes[parentId].subfolders = newNodes[parentId].subfolders.filter((sId) => sId !== id);
          else newNodes[parentId].documents = newNodes[parentId].documents.filter((doc) => doc.id !== id);
        }
        return newNodes;
      });
      if (!parentId) setRootIds((prev) => prev.filter((rid) => rid !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed.");
    }
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        nodes,
        rootIds,
        loading,
        error,
        members,
        setError,
        clearError,
        loadWorkspace,
        loadExplorer,
        expandFolder,
        loadMembers,
        updateWorkspaceName,
        updateMemberRole,
        addFolder,
        addDocument,
        renameNode,
        deleteNode,
        setMembers,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);