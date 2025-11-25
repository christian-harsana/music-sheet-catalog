import { useContext } from 'react'
import { Routes, Route, Link, Navigate, BrowserRouter } from 'react-router'
import { AuthContext, AuthProvider } from './contexts/AuthContext.tsx'
import { UIProvider } from './contexts/UIContext.tsx'
import Home from './pages/Home.tsx'
import Settings from './pages/Settings.tsx'
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

  console.log(user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


// Navigation

const Navigation = () => {

  const {isAuthenticated, logout} = useContext(AuthContext);

  if (isAuthenticated) {
    return (
      <nav>
        <Link to="/">Home</Link>
        <Link to="/settings">Settings</Link>
        <button type="button" onClick={logout}>Logout</button>
      </nav>
    )
  }
  else
  {
    return (
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>
    )
  }
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
            <Route 
              path="settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
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