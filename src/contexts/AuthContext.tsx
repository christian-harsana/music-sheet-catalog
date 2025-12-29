import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { ReactNode } from "react";
import type { AuthUser } from "../types/common.type";

type AuthContextType = {
  user: AuthUser | null,
  isAuthenticated: boolean,
  token: string | null,
  login: (user: AuthUser, token: string) => void,
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    token: null,
    login: () => {},
    logout: () => {}
});


export function AuthProvider({children} : {children: ReactNode}) {

    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthtenticated] = useState<boolean>(false);
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

        // Redirect to home
        navigate("/");
    }

    useEffect(() => {

        // Check local storage
        const cachedUser = localStorage.getItem(`music_sheet_catalog_user`);
        const cachedToken = localStorage.getItem(`music_sheet_catalog_token`);

        // If available setUser and setIsAuthtenticated
        if (cachedUser) {
            setUser(JSON.parse(cachedUser));
            setToken(cachedToken);
            setIsAuthtenticated(true);
        }

        // TODO: 
        // - implement appropriate persistent user mechanism using token - instead of relying on cachedUser (user info may change)
        // - separate auth token from the user data
        // - since useEffect is run after render, take care of the isAuthenticated state flicker - use loader
        // - when refreshing at protected route, the display redirect to login page eventhough token is available
    }, []);


    return(
        <AuthContext.Provider value={{user, isAuthenticated, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )

}