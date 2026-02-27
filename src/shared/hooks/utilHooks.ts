import { useState, useEffect, useContext } from "react";
import { ErrorContext } from "../../contexts/ErrorContext";
import type { ErrorContextType } from "../types/common.type";

export const useDebounce = (value: string, delay: number = 300): string => {

    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);

        return () => clearTimeout(timer);
    } ,[value, delay]);

    return debouncedValue;
};

export function useErrorHandler(): ErrorContextType {
    const context = useContext(ErrorContext);

    if (!context) throw new Error('useErrorHandler must be used within ErrorProvider');

    return context;
}