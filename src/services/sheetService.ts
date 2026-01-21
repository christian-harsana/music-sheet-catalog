import { api } from "../shared/utils/api";
import type { SheetFormData } from "../types/sheet.type";

export const createSheet = async (sheetData: SheetFormData, token: string) => {
    const response = await api.post(`sheet`, sheetData, token);
    const result = await response.json();
    return result;
};
    
export const getSheets = async (token: string) => {
    const response = await api.get(`sheet`, token);  
    const result = await response.json(); 
    return result;
};

export const updateSheet = async (id: string, sheetData: SheetFormData, token: string) => {
    const response = await api.put(`sheet/${id}`, sheetData, token);
    const result = await response.json(); 
    return result;
};

export const deleteSheet = async (id: string, token: string) => {
    const response = await api.delete(`sheet/${id}`, token);
    const result = await response.json(); 
    return result;
};