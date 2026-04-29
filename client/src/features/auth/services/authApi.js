import apiClient from "../../../apiClient";

export const authApi = {
    login: async(email,password)=>{
        return apiClient.post('auth/login',{email:email,password});
    },
    logout: async()=>{
        return apiClient.get('auth/logout')
    },
    getCurrentUser : async()=>{
        return  apiClient.get('auth/me')   
    },
    register : async(email,username,password)=>{
        return apiClient.post('auth/register',{email,username,password})
    }
}

