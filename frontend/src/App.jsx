import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Particles from './components/ui/Particles';
import AISenseiFloating from './components/ai-tutor/AISenseiFloating';

import HomePage from './pages/HomePage';
import EncyclopediaPage from './pages/EncyclopediaPage';
import MartialArtDetailPage from './pages/MartialArtDetailPage';
import TechniquesPage from './pages/TechniquesPage';
import TechniqueDetailPage from './pages/TechniqueDetailPage';
import VideoPage from './pages/VideoPage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import MapPage from './pages/MapPage';
import TrackerPage from './pages/TrackerPage';
import AISenseiPage from './pages/AISenseiPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

import './styles/globals.css';

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
              <Particles />
              <Navbar />
              <main>
                <Routes>
                  <Route path="/"                    element={<HomePage />} />
                  <Route path="/encyclopedia"        element={<EncyclopediaPage />} />
                  <Route path="/encyclopedia/:slug"  element={<MartialArtDetailPage />} />
                  <Route path="/techniques"          element={<TechniquesPage />} />
                  <Route path="/techniques/:slug"    element={<TechniqueDetailPage />} />
                  <Route path="/videos"              element={<VideoPage />} />
                  <Route path="/books"               element={<BooksPage />} />
                  <Route path="/books/:id"           element={<BookDetailPage />} />
                  <Route path="/map"                 element={<MapPage />} />
                  <Route path="/tracker"             element={<TrackerPage />} />
                  <Route path="/ai-sensei"           element={<AISenseiPage />} />
                  <Route path="/login"               element={<LoginPage />} />
                  <Route path="/register"            element={<RegisterPage />} />
                  <Route path="/auth/success"        element={<HomePage />} />
                  <Route path="/admin"               element={<AdminPage />} />
                  <Route path="*"                    element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              <AISenseiFloating />
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--card-border)',
                    backdropFilter: 'blur(16px)',
                  },
                }}
              />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
