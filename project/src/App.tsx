import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Presentations from './pages/Presentations';
import Podcasts from './pages/Podcasts';
import Shorts from './pages/Shorts';
import Comic from './pages/Comic';
import Navigation from './components/Navigation';
import { useLocation } from 'react-router-dom';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const showNav = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-white dark:bg-[#382D76]">
      {showNav && <Navigation />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/presentations" element={<Presentations />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/comic" element={<Comic />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;