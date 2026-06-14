import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', color: 'transparent' }}>
        Toma el control de tu futuro financiero
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
        Conéctate con expertos financieros en tiempo real y recibe asesoría personalizada para inversiones, ahorros y gestión de deudas.
      </p>
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
        <Link to="/register" className="btn" style={{ maxWidth: '200px' }}>
          Comenzar ahora
        </Link>
        <Link to="/login" className="btn" style={{ maxWidth: '200px', background: 'transparent', border: '1px solid var(--glass-border)' }}>
          Ya tengo cuenta
        </Link>
      </div>
    </div>
  );
};

export default Home;
