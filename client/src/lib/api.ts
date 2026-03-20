import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000',
})

// Before every request, grab the access token and attach it
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// If a request fails with 401, try refreshing the token then retry
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Avoid infinite loop — only retry once
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) {
                // No refresh token — send user to login
                window.location.href = '/login'
                return Promise.reject(error)
            }

            try {
                const { data } = await axios.post('http://localhost:5000/auth/refresh', {
                    refreshToken,
                })

                // Save the new tokens
                localStorage.setItem('accessToken', data.accessToken)
                localStorage.setItem('refreshToken', data.refreshToken)

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
                return api(originalRequest)
            } catch {
                // Refresh failed — clear everything and go to login
                localStorage.clear()
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)

export default api