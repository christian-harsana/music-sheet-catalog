import { createContext, useContext } from 'react';
import type { AuthUser } from '../shared/types/common.type';

type AuthContextType = {
	user: AuthUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	token: string | null;
	login: (user: AuthUser, token: string) => void;
	logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
	user: null,
	isAuthenticated: false,
	isLoading: true,
	token: null,
	login: () => {},
	logout: () => {},
});

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);

	if (!context) throw new Error('useAuth must be used within a AuthProvider');

	return context;
}
