import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { UIContext } from "../../contexts/UIContext";
import { HttpError } from "../../errors";


export const useDebounce = (value: string, delay: number = 300): string => {

    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);

        return () => clearTimeout(timer);
    } ,[value, delay]);

    return debouncedValue;
};


export const useErrorHandler = () => {

    const {logout} = useContext(AuthContext);
    const {addToast} = useContext(UIContext);

    const errorHandler = (error: unknown): void => {
     
        console.log('inside errorHandler Hook');
        console.log('addToast from context:', addToast);
        console.log('logout from context:', logout);
        
        const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
        const statusCode = error instanceof HttpError ? error.statusCode : 500;
    
        console.log(errorMessage);
        console.log(statusCode);

        switch (statusCode) {
            case 401:
                console.log('inside 401 case');
                addToast(errorMessage, "error"); 
                console.log('after addToast 401');
                logout();
                console.log('after logout');
                break;

            default:
                console.log('default');
                addToast(errorMessage, "error"); 
                break;
        }
    };

    return errorHandler;
};