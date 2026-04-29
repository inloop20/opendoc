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
  }
}

export default workspaceApi