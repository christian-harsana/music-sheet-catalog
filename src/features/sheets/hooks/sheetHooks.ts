import { useCallback, useContext, useEffect, useState } from 'react';
import { useDebounce, useErrorHandler } from '../../../shared/hooks/utilHooks';
import * as sheetService from '../services/sheetService'
import { AuthContext } from '../../../contexts/AuthContext';
import type { Sheet, SheetFormData } from '../types/sheet.type';
import type { PaginationData } from '../../../shared/types/common.type';

type SheetFilter = {
    key: string,
    level: string,
    genre: string,
    search: string,
    examPiece: boolean
}

export const useGetSheets = () => {

    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [refresh, setRefresh] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {token, logout} = useContext(AuthContext);
    const [paginationData, setPaginationData] = useState<PaginationData | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filters, setFilters] = useState<SheetFilter>({key: 'all', level: 'all', genre: 'all', examPiece: false, search: ''});
    const limit = 10;
    const totalPages = paginationData?.totalPages;
    const debouncedFiltersSearch = useDebounce(filters.search, 300);
    const {handleError} = useErrorHandler();

    const paginate = (pageNumber: number): void => {
        setCurrentPage(pageNumber);
    }

    const filterSheets = (filterQuery: SheetFilter): void => {
        setFilters(filterQuery);
        setCurrentPage(1);
    }

    useEffect(() => {

        const fetchSheets = async () => {
            if (!token) return;

            setIsLoading(true);

            try {

                const filterParams = new URLSearchParams;

                if (filters.key && filters.key.trim() !== 'all') filterParams.append('keyQuery', filters.key);
                if (filters.level && filters.level.trim() !== 'all') filterParams.append('levelQuery', filters.level);
                if (filters.genre && filters.genre.trim() !== 'all') filterParams.append('genreQuery', filters.genre);
                if (filters.examPiece) filterParams.append('examPieceQuery', filters.examPiece.toString());
                if (debouncedFiltersSearch) filterParams.append('searchQuery', debouncedFiltersSearch);

                const result = await sheetService.getSheets(token, currentPage, limit, filterParams);
            
                setSheets(result.data);
                setPaginationData(result.pagination);
            }
            catch (error: unknown) {
                handleError(error, { onUnauthorised: logout });
            }
            finally {
                setIsLoading(false);
            };
        }

        fetchSheets();
        
    }, [token, refresh, currentPage, filters.key, filters.level, filters.genre, filters.examPiece, debouncedFiltersSearch ]);

    const refreshSheets = useCallback(() => {
        setRefresh(prev => prev + 1);
    }, []);

    return { 
        sheets, 
        refreshSheets, 
        isLoading, 
        currentPage,
        paginate, 
        totalPages,
        filters,
        filterSheets
    };
}


export const useCreateSheet = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {logout} = useContext(AuthContext);
    const {handleError} = useErrorHandler();

    const createSheet = async (sheetData: SheetFormData, token: string) => {
        
        try {
            setIsLoading(true);
            const result = await sheetService.createSheet(sheetData, token);
            return result;
        }
        catch (error: unknown) {
            handleError(error, { onUnauthorised: logout });
        }
        finally {
            setIsLoading(false);
        }
    };

    return { createSheet, isLoading };
}


export const useUpdateSheet = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {logout} = useContext(AuthContext);
    const {handleError} = useErrorHandler();

    const updateSheet = async (id: string, sheetData: SheetFormData, token: string) => {
        
        try {
            setIsLoading(true);
            const result = await sheetService.updateSheet(id, sheetData, token);
            return result;
        }
        catch (error: unknown) {
            handleError(error, { onUnauthorised: logout });
        }
        finally {
            setIsLoading(false);
        }
    };

    return { updateSheet, isLoading };
}


export const useDeleteSheet = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {logout} = useContext(AuthContext);
    const {handleError} = useErrorHandler();

    const deleteSheet = async (id: string, token: string) => {
        
        try {
            setIsLoading(true);
            const result = await sheetService.deleteSheet(id, token);
            return result;
        }
        catch (error: unknown) {
            handleError(error, { onUnauthorised: logout });
        }
        finally {
            setIsLoading(false);
        }
    };

    return { deleteSheet, isLoading };
}