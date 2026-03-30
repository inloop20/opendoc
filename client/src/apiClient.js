import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.opendoc.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

apiClient.interceptors.response.use(
  (response) =>  response.data,
  
  async (error) => {
      if (!error.response) {
      return Promise.reject(new Error('Something went wrong with server'));
    }
    if (error.response?.status === 401 && !error.config?.url.includes('/auth/login') && window.location.pathname !== '/') {
      window.location.replace('/');
      return Promise.reject(error);
    }

    const errorMessage = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;