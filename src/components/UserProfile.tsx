import { useState, useContext, useEffect } from "react";
import { UIContext } from "../contexts/UIContext";
import { AuthContext } from "../contexts/AuthContext";
import type { AuthUser } from "../types/common.type";
import Loading from "./Loading";

const BASEURL = 'http://localhost:3000/';
const PROFILEURL = `${BASEURL}api/profile/`;

export default function UserProfile() {
    const {token} = useContext(AuthContext);
    const {addToast} = useContext(UIContext);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        if (!token) return;

        const fetchUser = async () => {
            try {

                const response = await fetch(`${PROFILEURL}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                const result = await response.json();
                const resultData: AuthUser = {
                    id: result.data.id,
                    email: result.data.email,
                    name: result.data.name
                }

                setUser(resultData);
            }
            catch(error: unknown) {

                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                addToast(errorMessage, "error");
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    // RENDER
    if (isLoading) {
        return (
            <Loading />
       )
    }

    return (
        <dl>
            <dt>Name:</dt>
            <dd>{user?.name}</dd>
            <dt>Email:</dt>
            <dd>{user?.email}</dd>
        </dl>
    )
}