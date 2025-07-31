// services/api.ts
class ApiService {
  private baseURL = import.meta.env.VITE_API_URL || '/api'

  private async request(endpoint: string, options: RequestInit = {}, token?: string) {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    // Add debug logging here
    console.log('API Request:', {
      url,
      method: config.method,
      headers: config.headers,
      body: config.body
    })

    const response = await fetch(url, config)
    
    // Add more detailed error logging
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        url,
        response: errorText
      })
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    return response.json()
  }

  async get(endpoint: string, token?: string) {
    return this.request(endpoint, { method: 'GET' }, token)
  }

  async post(endpoint: string, data?: any, token?: string) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, token)
  }
  
  async put(endpoint: string, data?: any, token?: string) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, token)
  }

  async delete(endpoint: string, token?: string) {
    return this.request(endpoint, { method: 'DELETE' }, token)
  }
}

const api = new ApiService()
export default api