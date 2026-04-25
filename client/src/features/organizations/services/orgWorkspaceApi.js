import apiClient from '../../../apiClient'

export const orgWorkspaceApi = {

    getOrgById: async(id)=>{
        return await apiClient.get(`/organizations/${id}`);
    },
    getOrgMembers: async(id) => {
        return await apiClient.get(`/organizations/${id}/members`)
    },
 

    getWorkspaces: async(id) =>{
        return await apiClient.get(`/workspaces/organization/${id}`)
    },
    createWorkspace: async(id,name) => {
        return await apiClient.post(`/workspaces/organization/${id}`,{name})
    }
}