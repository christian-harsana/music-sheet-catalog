import { createContext } from "react";
import type { ReactNode } from "react";
import type { ErrorContextType, ErrorHandlerOptions } from "../shared/types/common.type";
import { HttpError } from "../errors";

export const ErrorContext = createContext<ErrorContextType | null>(null);

export function ErrorProvider({children} : {children: ReactNode}) {

    const handleError = (error: unknown, {onUnauthorised, onError}: ErrorHandlerOptions = {}): void => {

        const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
        const statusCode = error instanceof HttpError ? error.statusCode : 500;

        switch (statusCode) {
            case 401:
                console.error(errorMessage);
                onError?.(errorMessage);
                onUnauthorised?.();
                break;

            default:
                console.error(errorMessage);
                onError?.(errorMessage);
                break;
        }
    };

    return(
        <ErrorContext.Provider value={{handleError}}>
            {children}
        </ErrorContext.Provider>
    )
}