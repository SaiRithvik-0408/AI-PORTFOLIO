import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PortfolioSite from './PortfolioSite';
import AdminPortal from './AdminPortal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioSite />} />
        <Route path="/login" element={<AdminPortal />} />
        {/* Redirect any other /path back to home or login as needed */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App
