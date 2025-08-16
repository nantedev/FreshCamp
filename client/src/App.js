import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Pages
import HomePage from './pages/HomePage';
import CampgroundsPage from './pages/CampgroundsPage';
// import CampgroundDetailPage from './pages/CampgroundDetailPage';
// import NewCampgroundPage from './pages/NewCampgroundPage';
// import EditCampgroundPage from './pages/EditCampgroundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Composants
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/campgrounds" element={<CampgroundsPage />} />
            {/* 
            Ces routes seront activées une fois que les composants seront créés
            <Route path="/campgrounds/:id" element={<CampgroundDetailPage />} />
            <Route path="/campgrounds/new" element={
              <ProtectedRoute>
                <NewCampgroundPage />
              </ProtectedRoute>
            } />
            <Route path="/campgrounds/:id/edit" element={
              <ProtectedRoute>
                <EditCampgroundPage />
              </ProtectedRoute>
            } />
            */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
