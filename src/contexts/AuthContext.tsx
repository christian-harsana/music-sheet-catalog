import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { ReactNode } from "react";
import type { AuthUser } from "../types/common.type";

type AuthContextType = {
  user: AuthUser | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  token: string | null,
  login: (user: AuthUser, token: string) => void,
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null,
    login: () => {},
    logout: () => {}
});

const BASEURL = 'http://localhost:3000/';
const VERIFYURL = `${BASEURL}api/auth/verify`;

export function AuthProvider({children} : {children: ReactNode}) {

    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthtenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    let navigate = useNavigate();

    const login = (user: AuthUser, token: string) => {

        // Store cached data into local storage
        localStorage.setItem(`music_sheet_catalog_user`, JSON.stringify(user));
        localStorage.setItem(`music_sheet_catalog_token`, token);
        localStorage.setItem(`music_sheet_catalog_isAuthenticated`, "true");

        // Update State
        setUser(user);
        setToken(token);
        setIsAuthtenticated(true);

        // Redirect to home
        navigate("/");
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        setIsAuthtenticated(false);

        // Remove persistent user from local storage
        localStorage.removeItem(`music_sheet_catalog_user`);
        localStorage.removeItem(`music_sheet_catalog_token`);
        localStorage.removeItem(`music_sheet_catalog_isAuthenticated`);

        // Redirect to login
        navigate("/login");
    }

    useEffect(() => {

        const verifyToken = async() => {

            // Check local storage for token
            const cachedToken = localStorage.getItem(`music_sheet_catalog_token`);

            if (!cachedToken) {
                setIsLoading(false);
                return;
            }

            try {

                const response = await fetch(`${VERIFYURL}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${cachedToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem(`music_sheet_catalog_token`);
                        navigate("/login");
                    }

                    throw new Error(`HTTP error! status ${response.status}`);
                }

                const result = await response.json();
                const user: AuthUser = result.data;
                
                localStorage.setItem(`music_sheet_catalog_user`, JSON.stringify(user));

                setUser(user);
                setToken(cachedToken);
                setIsAuthtenticated(true);
            }
            catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(errorMessage);
            }
            finally {
                setIsLoading(false);
            }
        }

        verifyToken();

    }, []);


    return(
        <AuthContext.Provider value={{user, isAuthenticated, isLoading, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}