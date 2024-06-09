import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// // Add a response interceptor to handle token expiry
// axiosInstance.interceptors.response.use(
//   (response) => {
//     debugger
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
// debugger
//     if (error.code == 'ERR_NETWORK') {
//         localStorage.removeItem("auth");
//         return
//     }

//     // Check if the error status is 401 and the original request was not retried
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       // Assume you have a refresh token endpoint
//       const refreshToken = localStorage.getItem('refreshToken');
//       const response = await axios.post('https://your-api-base-url.com/refresh-token', { token: refreshToken });

//       if (response.status === 200) {
//         const newToken = response.data.token;

//         // Update the token in localStorage
//         localStorage.setItem('token', newToken);

//         // Update the Authorization header and retry the original request
//         axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
//         originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

//         return axiosInstance(originalRequest);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
