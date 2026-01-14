const API_BASE_URL = 'http://localhost:3000/api';

const api = {
    get: async(endpoint: string, token?: string) => {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            });

            if (!response.ok) {
                throw new Error(`${response.status} - HTTP Error`);
            }

            return response;
        },

    post: async (endpoint: string, body: object, token?: string) => {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                ...(body && { body : JSON.stringify(body) })
            });

            if (!response.ok) {
                throw new Error(`${response.status} - HTTP Error`);
            }

            return response;
        },

    put: (endpoint: string, body: object, token?: string) =>
        fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            ...(body && { body : JSON.stringify(body) })
        }),

    delete: (endpoint: string, token?: string) =>
        fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            }
        }),
}

export { api };

// export default async function apiRequest(endPoint: string, options:{} = {}) {

//     const url = `${API_BASE_URL}${endPoint}`;

//     const config = {
//         headers: {
//             'Content-Type': 'application/json',
//             ...options.headers,
//         },
//         ...options
//     }

//     const response = await fetch(url, config);

//     if (!response.ok) {

//     }

//     return response.json();

// }