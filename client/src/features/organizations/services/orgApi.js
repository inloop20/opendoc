import apiClient from "../../../apiClient";

export const orgApi ={
    getUserOrgs: async()=>{
       return await apiClient.get('/users/organizations'); 
    },
    createOrg: async(name)=>{ 
        return await apiClient.post('/organizations',{name})
    },
    updateOrg: async(id,name)=>{
         
        return await apiClient.patch(`/organizations/${id}`,name);
    },
    deleteOrg: async(id)=>{

        return await apiClient.delete(`/organizations/${id}`);
    },

};