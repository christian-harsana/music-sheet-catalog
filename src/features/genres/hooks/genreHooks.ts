import { useContext, useEffect, useState } from "react";
import * as genreService from "../services/genreService";
import type { Genre, GenreFormData } from "../types/genre.type";
import { AuthContext } from "../../../contexts/AuthContext";
import { useErrorHandler } from "../../../shared/hooks/utilHooks";
import { UIContext } from "../../../contexts/UIContext";


export const useGetGenres = () => {

    const [genres, setGenres] = useState<Genre[]>([]);
    const [refresh, setRefresh] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {token, logout} = useContext(AuthContext);
    const {addToast} = useContext(UIContext);
    const {handleError} = useErrorHandler();

    useEffect(() => {

        const fetchGenres = async () => {
            if (!token) return;

            try {
                const result = await genreService.getGenres(token);
            
                setGenres(result.data);
            }
            catch (error: unknown) {
                handleError(error, { 
                    onUnauthorised: logout, 
                    onError: (message) => addToast(message, 'error') 
                });
            }
            finally {
                setIsLoading(false);
            };
        }

        fetchGenres();
        
    }, [token, refresh]);

    const refreshGenres = () => {
        setRefresh(prev => prev + 1);
    };

    return { genres, refreshGenres, isLoading };
}


export const useCreateGenre = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {logout} = useContext(AuthContext);
    const {addToast} = useContext(UIContext);
    const {handleError} = useErrorHandler();

    const createGenre = async (genreData: GenreFormData, token: string) => {
        
        try {
            setIsLoading(true);
            const result = await genreService.createGenre(genreData, token);
            return result;
        }
        catch (error: unknown) {
            handleError(error, { 
                onUnauthorised: logout, 
                onError: (message) => addToast(message, 'error') 
            });
        }
        finally {
            setIsLoading(false);
        }
    };

    return { createGenre, isLoading };
}


export const useUpdateGenre = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {logout} = useContext(AuthContext);
    const {addToast} = useContext(UIContext);
    const {handleError} = useErrorHandler();

    const updateGenre = async (id: string, genreData: GenreFormData, token: string) => {
        
        try {
            setIsLoading(true);
            const result = await genreService.updateGenre(id, genreData, token);
            return result;
        }
        catch (error: unknown) {
            handleError(error, { 
                onUnauthorised: logout, 
                onError: (message) => addToast(message, 'error') 
            });
        }
        finally {
            setIsLoading(false);
        }
    };

    return { updateGenre, isLoading };
}


export const useDeleteGenre = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {logout} = useContext(AuthContext);
    const {addToast} = useContext(UIContext);
    const {handleError} = useErrorHandler();

    const deleteGenre = async (id: string, token: string) => {
        
        try {
            setIsLoading(true);
            const result = await genreService.deleteGenre(id, token);
            return result;
        }
        catch (error: unknown) {
            handleError(error, { 
                onUnauthorised: logout, 
                onError: (message) => addToast(message, 'error') 
            });
        }
        finally {
            setIsLoading(false);
        }
    };

    return { deleteGenre, isLoading };
}