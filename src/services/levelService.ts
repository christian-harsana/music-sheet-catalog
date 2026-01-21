import { api } from "../shared/utils/api";
import type { LevelFormData } from "../types/level.type";

export const createLevel = async (levelData: LevelFormData, token: string) => {
    const response = await api.post(`level`, levelData, token);
    const result = await response.json(); 
    return result;
};
    
export const getLevels = async (token: string) => {
    const response = await api.get(`level`, token);  
    const result = await response.json(); 
    return result;
};

export const updateLevel = async (id: string, levelData: LevelFormData, token: string) => {
    const response = await api.put(`level/${id}`, levelData, token);
    const result = await response.json(); 
    return result;
};

export const deleteLevel = async (id: string, token: string) => {
    const response = await api.delete(`level/${id}`, token);
    const result = await response.json(); 
    return result;
};