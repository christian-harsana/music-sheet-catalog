import { createContext, useContext } from 'react';
import type { ErrorContextType } from '../shared/types/common.type';

export const ErrorContext = createContext<ErrorContextType | null>(null);

export function useError(): ErrorContextType {
	const context = useContext(ErrorContext);

	if (!context) throw new Error('useError must be used within a ErrorProvider');

	return context;
}
