import { useContext } from 'react'
import { Routes, Route, Navigate, BrowserRouter } from 'react-router'
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


// COMPONENT
function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <Routes>
            <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
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