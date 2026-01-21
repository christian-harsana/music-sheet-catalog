import { api } from "../shared/utils/api";
import type { SourceFormData } from "../types/source.type";

export const createSource = async (sourceData: SourceFormData, token: string) => {
    const response = await api.post(`source`, sourceData, token);
    const result = await response.json(); 
    return result;
};
    
export const getSources = async (token: string) => {
    const response = await api.get(`source`, token);  
    const result = await response.json(); 
    return result;
};

export const updateSource = async (id: string, sourceData: SourceFormData, token: string) => {
    const response = await api.put(`source/${id}`, sourceData, token);
    const result = await response.json(); 
    return result;
};

export const deleteSource = async (id: string, token: string) => {
    const response = await api.delete(`source/${id}`, token);
    const result = await response.json(); 
    return result;
};