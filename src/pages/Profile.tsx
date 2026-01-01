import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";
import UserProfile from "../components/UserProfile";

function Profile() {

    const {logout} = useContext(AuthContext);

    return (
        <main>
            <Navigation />
            
            <h1>Profile</h1>

            <div className="mb-6">
                <UserProfile />
            </div>

            <div className="mb-6">
                <button type="button" onClick={logout}>Logout</button>
            </div>
        </main>
    )

}

export default Profile;