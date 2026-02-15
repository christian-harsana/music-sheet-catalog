const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

const handleResponse = async (response: Response) => {

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`${response.status} - ${error.message || 'HTTP Error'}`);
    }

    return response;
}

export const api = {
    get: async(endpoint: string, token?: string) => {
            const response = await fetch(`${apiBaseURL}/${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            });

            return handleResponse(response);
        },

    post: async (endpoint: string, body: object, token?: string) => {
            const response = await fetch(`${apiBaseURL}/${endpoint}`, {
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

            const response = await fetch(`${apiBaseURL}/${endpoint}`, {
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
            
            const response = await fetch(`${apiBaseURL}/${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            });

            return handleResponse(response);
        }
}