import { useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../contexts/AuthContext";


export default function Navigation() {

  const {isAuthenticated} = useContext(AuthContext);

  return (
    <nav>
      <Link to="/" className="block">Home</Link>
      { 
        isAuthenticated ? 
        (
          <>
            <Link to="/settings" className="block">Settings</Link>
            <Link to="/profile" className="block">Profile</Link>
            <Link to="/genre" className="block">Genre</Link>
          </>
        ) :
        (
          <>
            <Link to="/signup" className="block">Sign Up</Link>
            <Link to="/login" className="block">Login</Link>
          </>
        )
      }
    </nav>
  )
}