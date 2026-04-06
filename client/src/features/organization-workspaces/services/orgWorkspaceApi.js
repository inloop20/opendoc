import apiClient from '../../../apiClient'

export const orgWorkspaceApi = {

    getOrgById: async(id)=>{
        return await apiClient.get(`/organizations/${id}`);
    },
    getWorkspaces: async(id) =>{
        return await apiClient.get(`/workspaces/organization/${id}`)
    }
}