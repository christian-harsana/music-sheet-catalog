import { useContext } from 'react'
import { Routes, Route, Navigate, BrowserRouter } from 'react-router'
import { AuthContext, AuthProvider } from './contexts/AuthContext'
import { UIProvider } from './contexts/UIContext.tsx'
import { ErrorProvider } from './contexts/ErrorContext.tsx'
import DashboardPage from './features/dashboard/pages/DashboardPage.tsx'
import ProfilePage from './features/profile/pages/ProfilePage.tsx'
import GenresPage from './features/genres/pages/GenresPage.tsx'
import LevelsPage from './features/levels/pages/LevelsPage.tsx'
import SourcesPage from './features/sources/pages/SourcesPage.tsx'
import SheetsPage from './features/sheets/pages/Sheet.tsx'
import Login from './features/auth/pages/LoginPage.tsx'
import SignUp from './features/auth/pages/SignUpPage.tsx'
import ErrorPage from './shared/pages/ErrorPage.tsx'
import LayoutSkeleton from './shared/components/Skeleton/LayoutSkeleton.tsx'


// Protected Route
type ProtectedRouteProps = {
  children: React.ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {

  const {token, isLoading} = useContext(AuthContext);

  if (isLoading) {
    return(<LayoutSkeleton />);
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
      <ErrorProvider>
        <AuthProvider>
          <UIProvider>
            <Routes>
              <Route index element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="genres" element={<ProtectedRoute><GenresPage /></ProtectedRoute>} />
              <Route path="levels" element={<ProtectedRoute><LevelsPage /></ProtectedRoute>} />
              <Route path="sources" element={<ProtectedRoute><SourcesPage /></ProtectedRoute>} />
              <Route path="sheets" element={<ProtectedRoute><SheetsPage /></ProtectedRoute>} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </UIProvider>
        </AuthProvider>
      </ErrorProvider>
    </BrowserRouter>
  )
}

export default App