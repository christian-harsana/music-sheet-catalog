import { useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../contexts/AuthContext";


export default function Navigation() {

  const {isAuthenticated} = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">Home</Link>
      { 
        isAuthenticated ? 
        (
          <>
            <Link to="/settings">Settings</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/genre">Genre</Link>
          </>
        ) :
        (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </>
        )
      }
    </nav>
  )
}