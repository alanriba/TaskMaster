import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 
import AuthProvider from './providers/AuthProvider';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import Navbar from './components/layout/NavBar';
import ProtectedRoute from './components/auth/ProtectedRouted';
import DashboardPage from './pages/DashboardPage';
import ThemeProvider from './providers/ThemeProviders';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;