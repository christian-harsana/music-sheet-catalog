import { useContext, useEffect, useState } from "react";
import * as sourceService from "../services/sourceService";
import type { Source, SourceFormData } from "../types/source.type";
import { AuthContext } from "../../../contexts/AuthContext";


export const useGetSources = () => {

    const [sources, setSources] = useState<Source[]>([]);
    const [refresh, setRefresh] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {token} = useContext(AuthContext);

    useEffect(() => {

        const fetchSources = async () => {
            if (!token) return;

            try {
                const result = await sourceService.getSources(token);
            
                setSources(result.data);
            }
            catch (error: unknown) {

                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(errorMessage); // TODO: Create error handlers
            }
            finally {
                setIsLoading(false)
            };
        }

        fetchSources();
        
    }, [token, refresh]);

    const refreshSources = () => {
        setRefresh(prev => prev + 1);
    };

    return { sources, refreshSources, isLoading };
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