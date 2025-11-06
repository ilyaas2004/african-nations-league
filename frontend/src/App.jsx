// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import TeamRegistration from './pages/TeamRegistration';
import MyTeam from './pages/MyTeam';
import AdminPanel from './pages/AdminPanel';
import TeamsList from './pages/TeamsList';
import Bracket from './pages/Bracket';
import TopScorers from './pages/TopScorers';
import MatchDetails from './pages/MatchDetails';
import PastWinners from './pages/PastWinners'; 

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes without layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes with layout */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          {/* Public routes with layout */}
          <Route
            path="/bracket"
            element={
              <Layout>
                <Bracket />
              </Layout>
            }
          />

          <Route
            path="/teams"
            element={
              <Layout>
                <TeamsList />
              </Layout>
            }
          />

          <Route
            path="/scorers"
            element={
              <Layout>
                <TopScorers />
              </Layout>
            }
          />
          <Route
  path="/past-winners"
  element={
    <Layout>
      <PastWinners />
    </Layout>
  }
/>


          <Route
            path="/match/:id"
            element={
              <Layout>
                <MatchDetails />
              </Layout>
            }
          />

          {/* Protected Representative Routes */}
          <Route
            path="/register-team"
            element={
              <ProtectedRoute>
                <Layout>
                  <TeamRegistration />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/my-team"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyTeam />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <AdminPanel />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;