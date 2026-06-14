import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="app-header">
      <Link to="/" className="logo">AsistenciaFinanciera</Link>
      <nav>
        <ul className="nav-links">
          {user ? (
            <>
              {user.role === 'admin' && <li><Link to="/admin">Panel Admin</Link></li>}
              <li><Link to="/chat">Mis Asesorías</Link></li>
              <li><Link to="/profile">Mi Perfil</Link></li>
              <li style={{ marginLeft: '1rem', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {user.avatarUrl && <img src={user.avatarUrl} alt="Avatar" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />}
                  <span>{user.name}</span>
                </div>
              </li>
              <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Iniciar Sesión</Link></li>
              <li><Link to="/register" className="btn" style={{ padding: '0.5rem 1rem' }}>Registrarse</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;

