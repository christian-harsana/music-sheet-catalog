import { useCallback, useContext, useEffect, useState } from 'react';
import * as sheetService from '../services/sheetService'
import type { Sheet, SheetFormData } from '../types/sheet.type';
import { AuthContext } from '../../../contexts/AuthContext';


export const useGetSheets = () => {

    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [refresh, setRefresh] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {token} = useContext(AuthContext);

    useEffect(() => {

        const fetchSheets = async () => {
            if (!token) return;

            try {
                const result = await sheetService.getSheets(token);
            
                setSheets(result.data);
            }
            catch (error: unknown) {

                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(errorMessage); // TODO: Create error handlers
            }
            finally {
                setIsLoading(false)
            };
        }

        fetchSheets();
        
    }, [token, refresh]);

    const refreshSheets = useCallback(() => {
        setRefresh(prev => prev + 1);
    }, []);

    return { sheets, refreshSheets, isLoading };
}


export const useCreateSheet = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const createSheet = async (sheetData: SheetFormData, token: string) => {
        
        try {
            setIsLoading(true);
            const result = await sheetService.createSheet(sheetData, token);
            return result;
        }
        catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(errorMessage); // TODO: Create error handlers
        }
        finally {
            setIsLoading(false);
        }
    };

    return { createSheet, isLoading };
}


export const useUpdateSheet = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const updateSheet = async (id: string, sheetData: SheetFormData, token: string) => {
        
        try {
            setIsLoading(true);
            const result = await sheetService.updateSheet(id, sheetData, token);
            return result;
        }
        catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(errorMessage); // TODO: Create error handlers
        }
        finally {
            setIsLoading(false);
        }
    };

    return { updateSheet, isLoading };
}


export const useDeleteSheet = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const deleteSheet = async (id: string, token: string) => {
        
        try {
            setIsLoading(true);
            const result = await sheetService.deleteSheet(id, token);
            return result;
        }
        catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(errorMessage); // TODO: Create error handlers
        }
        finally {
            setIsLoading(false);
        }
    };

    return { deleteSheet, isLoading };
}