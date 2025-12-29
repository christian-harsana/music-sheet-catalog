import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import type { AuthUser } from "../types/common.type";

const BASEURL = 'http://localhost:3000/';
const PROFILEURL = `${BASEURL}api/profile/`;

function Profile() {

    const {token, logout} = useContext(AuthContext);
    const [user, setUser] = useState<AuthUser | null>(null);

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

                alert(errorMessage);
                console.log(errorMessage); // TODO: Implement error handling
            }
            finally {
                // TODO: set loading state to false
            }
        };

        fetchUser();
    }, [token])


    // RENDER
    return (
        <div className="u-text-align-left">
            <h1>Profile</h1>

            <dl className="l-v-spacing-lv-3">
                <dt>Name:</dt>
                <dd>{user?.name}</dd>
                <dt>Email:</dt>
                <dd>{user?.email}</dd>
            </dl>

            <div className="l-v-spacing-lv-3">
                <button type="button" onClick={logout}>Logout</button>
            </div>
        </div>
    )

}

export default Profile;