import { useContext } from 'react'
import { Routes, Route, Link, Navigate, BrowserRouter } from 'react-router'
import { AuthContext, AuthProvider } from './contexts/AuthContext.tsx'
import { UIProvider } from './contexts/UIContext.tsx'
import Home from './pages/Home.tsx'
import Settings from './pages/Settings.tsx'
import Profile from './pages/Profile.tsx'
import Login from './pages/Login.tsx'
import SignUp from './pages/SignUp.tsx'
import Error from './pages/Error.tsx'
import './App.css'


// Protected Route
type ProtectedRouteProps = {
  children: React.ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {

  const {user} = useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


// Navigation

const Navigation = () => {

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


// COMPONENT
function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <Navigation />
          
          <Routes>
            <Route index element={<Home />} />
            <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App