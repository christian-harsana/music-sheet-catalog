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
            <Link to="/settings" className="ms-3">Settings</Link>
            <Link to="/profile" className="ms-3">Profile</Link>
            <Link to="/genre" className="ms-3">Genre</Link>
          </>
        ) :
        (
          <>
            <Link to="/signup" className="ms-3">Sign Up</Link>
            <Link to="/login" className="ms-3">Login</Link>
          </>
        )
      }
    </nav>
  )
}