import apiClient from "../../../apiClient";

export const orgApi ={
    getUserOrgs: async()=>{
       return await apiClient.get('/users/organizations'); 
    },
    createOrg: async(name)=>{ 
        return await apiClient.post('/organizations',{name})
    },
    updateOrg: async(id,name)=>{
         
        return await apiClient.patch(`/organizations/${id}`,{name});
    },
    deleteOrg: async(id)=>{

        return await apiClient.delete(`/organizations/${id}`);
    },

    addUsers: async(id,email)=>{
        return await apiClient.post(`/organizations/${id}/members`,{email})
    },
    removeMember: async(orgId,memberId) => {
        return await apiClient.delete(`/organizations/${orgId}/members/${memberId}`)
    },
    updateMemberRole: async(orgId,userId,role) => {
        return await apiClient.patch(`/organizations/${orgId}/members/${userId}`,{role})
    },
    getOrgPermissions: async(orgId) => {
        return await apiClient.get(`/organizations/${orgId}/permissions`);
    },
    leaveOrganization : async(orgId) => {
        return await apiClient.delete(`/organizations/${orgId}/leave`)
    }

};