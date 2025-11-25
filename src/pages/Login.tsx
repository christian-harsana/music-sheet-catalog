import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function Login() {

    const {login} = useContext(AuthContext);

    return(
        <>
            <p>Hello... Login page.</p>
            <button type="button" onClick={login}>Login</button>
        </>
    )

}

export default Login;