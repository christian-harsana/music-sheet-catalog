import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { ReactNode } from "react";
import type { AuthUserType } from "../types/common.type";

type AuthContextType = {
  user: AuthUserType | null,
  isAuthenticated: boolean,
  login: (user: AuthUserType) => void,
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {}
});


export function AuthProvider({children} : {children: ReactNode}) {

    const [user, setUser] = useState<AuthUserType | null>(null);
    const [isAuthenticated, setIsAuthtenticated] = useState<boolean>(false);
    let navigate = useNavigate();

    const login = (user: AuthUserType) => {

        // Store user to local storage
        localStorage.setItem(`music_sheet_catalog_user`, JSON.stringify(user));
        localStorage.setItem(`music_sheet_catalog_isAuthenticated`, "true");

        // Update State
        setUser(user);
        setIsAuthtenticated(true);

        // Redirect to home
        navigate("/");
    }

    const logout = () => {
        setUser(null);
        setIsAuthtenticated(false);

        // Remove persistent user from local storage
        localStorage.removeItem(`music_sheet_catalog_user`);
        localStorage.removeItem(`music_sheet_catalog_isAuthenticated`);

        // Redirect to home
        navigate("/");
    }

    useEffect(() => {

        // Check local storage
        const cachedUser = localStorage.getItem(`music_sheet_catalog_user`);

        // If available setUser and setIsAuthtenticated
        if (cachedUser) {
            setUser(JSON.parse(cachedUser));
            setIsAuthtenticated(true);
        }

        // TODO: 
        // - implement appropriate persistent user mechanism using token
        // - since useEffect is run after render, take care of the isAuthenticated state flicker
    }, []);


    return(
        <AuthContext.Provider value={{user, isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    )

}