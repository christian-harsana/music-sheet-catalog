import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import UserProfile from "../components/UserProfile";

function Profile() {

    const {logout} = useContext(AuthContext);

    return (
        <div className="u-text-align-left">
            <h1>Profile</h1>

            <div className="mb-6">
                <UserProfile />
            </div>

            <div className="mb-6">
                <button type="button" onClick={logout}>Logout</button>
            </div>
        </div>
    )

}

export default Profile;