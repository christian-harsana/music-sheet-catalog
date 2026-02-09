import { useCallback, useContext, useEffect, useState } from 'react';
import * as sheetService from '../services/sheetService'
import { AuthContext } from '../../../contexts/AuthContext';
import type { Sheet, SheetFormData } from '../types/sheet.type';
import type { PaginationData } from '../../../shared/types/common.type';


export const useGetSheets = () => {

    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [refresh, setRefresh] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {token} = useContext(AuthContext);
    const [paginationData, setPaginationData] = useState<PaginationData | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const limit = 5;
    const totalPages = paginationData?.totalPages;

    const paginate = (pageNumber: number): void => {
        setCurrentPage(pageNumber);
    }

    useEffect(() => {

        const fetchSheets = async () => {
            if (!token) return;

            try {
                const result = await sheetService.getSheets(token, currentPage, limit);
            
                setSheets(result.data);
                setPaginationData(result.pagination);
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
        
    }, [token, refresh, currentPage]);

    const refreshSheets = useCallback(() => {
        setRefresh(prev => prev + 1);
    }, []);

    return { 
        sheets, 
        refreshSheets, 
        isLoading, 
        currentPage, 
        paginate, 
        totalPages 
    };
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