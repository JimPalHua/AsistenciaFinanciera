import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { Camera, Save, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [description, setDescription] = useState(user?.description || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ name, avatarUrl, description, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al actualizar perfil');

      login(data);
      setMessage('Perfil actualizado exitosamente');
      setPassword('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
    }
  };

  return (
    <div className="glass-panel auth-form-container" style={{ maxWidth: '600px' }}>
      <h2>Tu Perfil</h2>
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      {message && <div style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img 
          src={avatarUrl || 'https://via.placeholder.com/100'} 
          alt="Avatar" 
          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
        />
      </div>

      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>URL del Avatar</label>
          <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://ejemplo.com/mifoto.jpg" />
        </div>
        <div className="form-group">
          <label>Biografía / Descripción</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            rows={3} 
            style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}
            placeholder="Escribe algo sobre ti..."
          ></textarea>
        </div>
        <div className="form-group">
          <label>Nueva Contraseña (Opcional)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Dejar en blanco para no cambiar" />
        </div>
        <button type="submit" className="btn mt-4">Actualizar Perfil</button>
      </form>
    </div>
  );
};

export default Profile;
