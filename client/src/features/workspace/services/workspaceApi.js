import apiClient from "../../../apiClient"

 const workspaceApi = {
  getFolders : async(workspaceId)=>{
    return await apiClient.get(`folders/workspace/${workspaceId}`)
  },
  getFolderContent :async(folderId)=>{
    return await apiClient.get(`folders/${folderId}`)
  },
  getWorkspace : async(workspaceApi)=>{
    return await apiClient.get(`workspaces/${workspaceApi}`)
  },
  createFolder: async(workspaceId,parentFolderId,name) => {
    return await apiClient.post(`folders/workspace/${workspaceId}`,{name,parentFolderId})
  },
  createDocument: async(folderId,title) =>{
    return await apiClient.post(`documents/folder/${folderId}`,{title})
  },
  getDocument: async(docId)=>{
    return await apiClient.get(`documents/${docId}`)
  },
  getMembers: async(id)=>{
    return await apiClient.get(`workspaces/${id}/members`)
  },
  addMember: async(id,email)=>{
    return await apiClient.post(`workspaces/${id}/members`,{email})
  },
  updateWorkspace: async(id,name)=>{
  return await apiClient.patch(`workspaces/${id}`,name)
  },
  updateMemberRole: async(id,userId,role)=>{
    return await apiClient.patch(`workspaces/${id}/members/${userId}`,{role})
  },
  removeMember: async(id,userId)=>{
    return await apiClient.delete(`workspaces/${id}/members/${userId}`)
  },
  leaveWorkspace: async(id) =>{
    return await apiClient.delete(`workspaces/${id}/leave`)
  },
  deleteWorkspace: async(id,userId) =>{
    return await apiClient.delete(`workspaces/${id}`)
  },
  updateFolder : async(id,name) => {
  return await apiClient.patch(`folders/${id}`,name)
  },
  updateDocument : async(id,name)=>{
    return await apiClient.patch(`documents/${id}`,name)
  },
  deleteFolder : async(id)=>{
    return await apiClient.delete(`folders/${id}`)
  },
  deleteDocument : async(id)=>{
    return await apiClient.delete(`documents/${id}`)
  },
  getDocumentPermissions: async(id) =>{
    return await apiClient.get(`documents/${id}/permissions`)
  },
  getComments : async(id)=>{
    return await apiClient.get(`documents/${id}/comments`)
  },
  createComment: async(id,content)=>{
    return await apiClient.post(`documents/${id}/comments`,content)
  }
}

export default workspaceApi