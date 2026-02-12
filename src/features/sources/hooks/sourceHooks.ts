import { useCallback, useContext, useEffect, useState } from "react";
import * as sourceService from "../services/sourceService";
import type { Source, SourceFormData } from "../types/source.type";
import { AuthContext } from "../../../contexts/AuthContext";
import type { PaginationData } from "../../../shared/types/common.type";


export const useGetSources = () => {

    const [sources, setSources] = useState<Source[]>([]);
    const [refresh, setRefresh] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {token} = useContext(AuthContext);
    const [paginationData, setPaginationData] = useState<PaginationData | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const limit = 10;
    const totalPages = paginationData?.totalPages; 

    const paginate = (pageNumber: number): void => {
        setCurrentPage(pageNumber);
    }

    useEffect(() => {

        const fetchSources = async () => {
            if (!token) return;

            setIsLoading(true);

            try {
                const result = await sourceService.getSources(token, currentPage, limit);
             
                setSources(result.data);
                setPaginationData(result.pagination);
            }
            catch (error: unknown) {

                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(errorMessage); // TODO: Create error handlers
            }
            finally {
                setIsLoading(false);
            };
        }

        fetchSources();
        
    }, [token, refresh, currentPage]);

    const refreshSources = useCallback(() => {
        setRefresh(prev => prev + 1);
    }, []);

    return { 
        sources, 
        refreshSources, 
        isLoading,
        currentPage,
        paginate,
        totalPages
    };
}


export const useCreateSource = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const createSource = async (sourceData: SourceFormData, token: string) => {
        
        try {
            setIsLoading(true);
            const result = await sourceService.createSource(sourceData, token);
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

    return { createSource, isLoading };
}


export const useUpdateSource = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const updateSource = async (id: string, sourceData: SourceFormData, token: string) => {
        
        try {
            setIsLoading(true);
            const result = await sourceService.updateSource(id, sourceData, token);
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

    return { updateSource, isLoading };
}


export const useDeleteSource = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const deleteSource = async (id: string, token: string) => {
        
        try {
            setIsLoading(true);
            const result = await sourceService.deleteSource(id, token);
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

    return { deleteSource, isLoading };
}