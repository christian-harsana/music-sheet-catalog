import { useContext } from 'react'
import { Routes, Route, Navigate, BrowserRouter } from 'react-router'
import { AuthContext, AuthProvider } from './contexts/AuthContext.tsx'
import { UIProvider } from './contexts/UIContext.tsx'
import Home from './pages/Home.tsx'
import Profile from './pages/Profile.tsx'
import Genre from './pages/Genre.tsx'
import Level from './pages/Level.tsx'
import Source from './pages/Source.tsx'
import Sheet from './pages/Sheet.tsx'
import Login from './pages/Login.tsx'
import SignUp from './pages/SignUp.tsx'
import Error from './pages/Error.tsx'
import './App.css'


// Protected Route
type ProtectedRouteProps = {
  children: React.ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {

  const {token, isLoading} = useContext(AuthContext);

  if (isLoading) {
    return(<div className='text-white'>Loading...</div>); // TODO: Implement full page loading indicator
  }

  if (!token) {
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
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="genre" element={<ProtectedRoute><Genre /></ProtectedRoute>} />
            <Route path="level" element={<ProtectedRoute><Level /></ProtectedRoute>} />
            <Route path="source" element={<ProtectedRoute><Source /></ProtectedRoute>} />
            <Route path="sheet" element={<ProtectedRoute><Sheet /></ProtectedRoute>} />
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