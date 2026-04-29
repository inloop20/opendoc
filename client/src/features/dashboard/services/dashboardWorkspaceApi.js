import apiClient from "../../../apiClient"

export const dashboardWorkspaceApi = {
    getMyWorkspace : async()=>{
        return await apiClient.get(`/users/workspaces`)
    }
}