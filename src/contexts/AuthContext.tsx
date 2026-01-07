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

        // TEMP: checking token
        // const decoded = jwtDecode(token);
        // const issuedAt = new Date(decoded.iat * 1000);
        // const expiresAt = new Date(decoded.exp * 1000);
        // const duration = (decoded.exp - decoded.iat) * 1000; // in milliseconds

        // console.log('Token issued at:', issuedAt);
        // console.log('Token expires at:', expiresAt);
        // console.log('Duration:', duration, 'ms');
        // console.log('Duration in hours:', duration / 1000 / 60 / 60, 'hours');


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

        // Check local storage for token
        const cachedToken = localStorage.getItem(`music_sheet_catalog_token`);

        // Verify token
        try {
            const verifyToken = async() => {

                const response = await fetch(`${VERIFYURL}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${cachedToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();
                const user: AuthUser = result.data;
                
                localStorage.setItem(`music_sheet_catalog_user`, JSON.stringify(user));

                setUser(user);
                setToken(cachedToken);
                setIsAuthtenticated(true);
                setIsLoading(false);
            }

            verifyToken();
        }
        catch (error: unknown) {

            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(errorMessage); // TODO: any better error handling?
            setIsLoading(false);
        }
    }, []);


    return(
        <AuthContext.Provider value={{user, isAuthenticated, isLoading, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}