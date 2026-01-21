import { api } from "../shared/utils/api";
import type { GenreFormData } from "../types/genre.type";

export const createGenre = async (genreData: GenreFormData, token: string) => {
    const response = await api.post(`genre`, genreData, token);
    const result = await response.json(); 
    return result;
};
    
export const getGenres = async (token: string) => {
    const response = await api.get(`genre`, token);  
    const result = await response.json(); 
    return result;
};

export const updateGenre = async (id: string, genreData: GenreFormData, token: string) => {
    const response = await api.put(`genre/${id}`, genreData, token);
    const result = await response.json(); 
    return result;
};

export const deleteGenre = async (id: string, token: string) => {
    const response = await api.delete(`genre/${id}`, token);
    const result = await response.json(); 
    return result;
};