const API_BASE_URL = 'http://localhost:3000/api';

const handleResponse = async (response: Response) => {

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`${response.status} - ${error.message || 'HTTP Error'}`);
    }

    return response;
}

export const api = {
    get: async(endpoint: string, token?: string) => {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            });

            return handleResponse(response);
        },

    post: async (endpoint: string, body: object, token?: string) => {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body : JSON.stringify(body)
            });

            return handleResponse(response);
        },

    put: async (endpoint: string, body: object, token?: string) => {

            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body : JSON.stringify(body)
            });

            return handleResponse(response);
        },
        

    delete: async (endpoint: string, token?: string) => {
            
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            });

            return handleResponse(response);
        }
}