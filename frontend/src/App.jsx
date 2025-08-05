import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/login';
import Register from './pages/reg';
import AdminDashboard from './pages/admin';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/admin" /> : 
              <Login onLogin={login} />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? 
              <Navigate to="/admin" /> : 
              <Register onLogin={login} />
            } 
          />
          <Route 
            path="/admin" 
            element={
              isAuthenticated ? 
              <AdminDashboard user={user} onLogout={logout} /> : 
              <Navigate to="/register" />
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/admin" : "/register"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
