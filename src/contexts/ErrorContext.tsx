import { createContext, useContext } from "react";
import { UIContext } from "./UIContext";
import type { ReactNode } from "react";
import type { ErrorContextType, ErrorHandlerOptions } from "../shared/types/common.type";
import { HttpError } from "../errors";


export const ErrorContext = createContext<ErrorContextType | null>(null);


export function ErrorProvider({children} : {children: ReactNode}) {

    const {addToast} = useContext(UIContext);

    const handleError = (error: unknown, {onUnauthorised}: ErrorHandlerOptions = {}): void => {

        const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
        const statusCode = error instanceof HttpError ? error.statusCode : 500;
    
        switch (statusCode) {
            case 401:
                addToast(errorMessage, "error"); 
                onUnauthorised?.()
                break;

            default:
                addToast(errorMessage, "error"); 
                break;
        }
    };

    return(
        <ErrorContext.Provider value={{handleError}}>
            {children}
        </ErrorContext.Provider>
    )
}