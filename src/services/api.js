
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: status => status >= 200 && status < 500, // Handle all responses
  timeout: 10000, // 10 second timeout
});


const isLoginOrRegister = (url = '') => {
  const path = url.replace(/^\/+/, '');
  return path === 'auth/login' || path === 'auth/register';
};


apiClient.interceptors.request.use(
  (config) => {
    try {
     
      if (!isLoginOrRegister(config.url)) {
        const token = localStorage.getItem('jwt_token');
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
  
    } catch (e) {
     
    }
    return config;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  (response) => {
    
    if (response.status >= 200 && response.status < 300) {
        return response.data; 
    }
    
    return Promise.reject(response.data);
  },
  (error) => {
    const resp = error.response;
    if (resp && (resp.status === 401 || resp.status === 403)) {
      const reqUrl = (error.config && error.config.url) || '';
      if (!isLoginOrRegister(reqUrl)) {
        localStorage.removeItem('jwt_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
   
    const errorData = error.response?.data || { message: error.message || 'An unexpected error occurred.' };
    return Promise.reject(errorData);
  }
);


export async function loginUser(email, password) {
  
  try {
    const resp = await axios.post(`${apiClient.defaults.baseURL}/auth/login`, {
      email: email,
      password: password
    });
    
    if (resp.data?.token) {
      localStorage.setItem('jwt_token', resp.data.token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${resp.data.token}`;
      return resp.data;
    } else {
      throw new Error('No authentication token received');
    }
  } catch (error) {
     const message = error.response?.data?.message || error.message || 'Invalid credentials';
     console.error('Login error details:', message);
     throw new Error(message);
  }
}

export async function registerUser(fullName, email, password) {

  return axios.post(`${apiClient.defaults.baseURL}/auth/register`, { fullName, email, password });
}


export async function fetchUserInterviews() { 
  try {
    console.log('Fetching all interviews...');
    const respData = await apiClient.get('/interviews'); 
    
    console.log('Interviews response data:', respData);

    const interviews = Array.isArray(respData) ? respData : [];
    return interviews;
  } catch (error) {
    console.error('Error fetching interviews:', error);
    throw new Error(error.message || 'Failed to fetch interviews.');
  }
}


export async function fetchInterviewById(id) { 
  try {
    const respData = await apiClient.get(`/interviews/${id}`);
    return respData;
  } catch (error) {
    console.error('Error fetching interview:', error);
    throw new Error('Failed to fetch interview details.');
  }
}

export async function fetchCurrentUser() {
  try {
    const respData = await apiClient.get('/auth/me');
    return respData;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error; 
  }
}
// ------------------------------------

export async function createInterviewAndGenerateQuestions(data) {
  try {
    const respData = await apiClient.post('/interviews', data);
    return respData;
  } catch (error) {
    console.error('Error creating interview:', error);
    throw new Error('Failed to create interview.');
  }
}

export default apiClient;
