import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function Profile() {

    const {user, logout} = useContext(AuthContext);

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