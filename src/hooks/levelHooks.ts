import { useContext, useEffect, useState } from "react";
import * as levelService from "../services/levelService";
import type { Level, LevelFormData } from "../types/level.type";
import { AuthContext } from "../contexts/AuthContext";


export const useGetLevels = () => {

    const [levels, setLevels] = useState<Level[]>([]);
    const [refresh, setRefresh] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {token} = useContext(AuthContext);

    useEffect(() => {

        const fetchLevels = async () => {
            if (!token) return;

            try {
                const result = await levelService.getLevels(token);
            
                setLevels(result.data);
            }
            catch (error: unknown) {

                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(errorMessage); // TODO: Create error handlers
            }
            finally {
                setIsLoading(false)
            };
        }

        fetchLevels();
        
    }, [token, refresh]);

    const refreshLevels = () => {
        setRefresh(prev => prev + 1);
    };

    return { levels, refreshLevels, isLoading };
}


export const useCreateLevel = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const createLevel = async (levelData: LevelFormData, token: string) => {
        
        try {
            setIsLoading(true);
            const result = await levelService.createLevel(levelData, token);
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

    return { createLevel, isLoading };
}


export const useUpdateLevel = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const updateLevel = async (id: string, levelData: LevelFormData, token: string) => {
        
        try {
            setIsLoading(true);
            const result = await levelService.updateLevel(id, levelData, token);
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

    return { updateLevel, isLoading };
}


export const useDeleteLevel = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const deleteLevel = async (id: string, token: string) => {
        
        try {
            setIsLoading(true);
            const result = await levelService.deleteLevel(id, token);
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

    return { deleteLevel, isLoading };
}