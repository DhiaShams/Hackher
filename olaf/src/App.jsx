import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import LuminaLensApp from './LuminaLensApp';
import InteractiveAvatarShowcase from './features/avatar-character/InteractiveAvatarShowcase';
import { Home, Sparkles } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const isAvatarDemo = location.pathname === '/avatar-demo';

  return (
    <div className="app-container">
      {/* Navigation - Only show on avatar demo page */}
      {isAvatarDemo && (
        <nav style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          zIndex: 10000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <NavLink to="/" icon={<Home size={20} />} label="Lumina Lens" />
          <NavLink to="/avatar-demo" icon={<Sparkles size={20} />} label="Avatar Demo" />
        </nav>
      )}

      {/* Floating nav button on Lumina Lens page */}
      {!isAvatarDemo && (
        <Link
          to="/avatar-demo"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 10000,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '25px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
          }}
        >
          <Sparkles size={20} />
          Avatar Demo
        </Link>
      )}

      {/* Main Content */}
      <div style={{ paddingTop: isAvatarDemo ? '70px' : '0' }}>
        <Routes>
          <Route path="/" element={<LuminaLensApp />} />
          <Route path="/avatar-demo" element={<InteractiveAvatarShowcase />} />
        </Routes>
      </div>
    </div>
  );
}

// Navigation Link Component
const NavLink = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        background: isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '16px',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)',
        border: isActive ? '2px solid rgba(255,255,255,0.5)' : '2px solid transparent'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {icon}
      {label}
    </Link>
  );
};

export default App;
