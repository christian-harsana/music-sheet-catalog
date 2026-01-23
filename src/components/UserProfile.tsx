import { useState, useContext, useEffect } from "react";
import { UIContext } from "../contexts/UIContext";
import { AuthContext } from "../contexts/AuthContext";
import type { AuthUser } from "../types/common.type";
import Loading from "../shared/components/Loading";
import { api } from "../shared/utils/api";


export default function UserProfile() {
    const {token} = useContext(AuthContext);
    const {addToast} = useContext(UIContext);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        if (!token) return;

        const fetchUser = async () => {
            try {

                const response = await api.get(`profile`, token);
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
        return (<Loading />)
    }

    return (
        <div className="px-5 py-5 w-full h-auto max-w-xs rounded-md border border-gray-300">
            <div className="flex justify-center items-center m-auto mb-6 text-center w-25 h-25 rounded-full bg-violet-400 text-gray-50 text-5xl font-semibold uppercase">
                {user?.name[0]}
            </div>
            <dl className="flex flex-wrap gap-3">
                <dt className="w-[calc(50%-0.5rem)]">Name:</dt>
                <dd className="w-[calc(50%-0.5rem)] text-right font-semibold">{user?.name}</dd>
                <dt className="w-[calc(50%-0.5rem)]">Email:</dt>
                <dd className="w-[calc(50%-0.5rem)] text-right font-semibold">{user?.email}</dd>
            </dl>
        </div>
    )
}