import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminMessage {
  _id: string;
  content: string;
  createdAt: string;
  sender?: { name: string; role: string };
  receiver?: { name: string };
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${user?.token}` };
        
        const resUsers = await fetch(`${API_URL}/api/auth/users`, { headers });
        const dataUsers = await resUsers.json();
        if (!resUsers.ok) throw new Error(dataUsers.message);
        setUsers(dataUsers);

        const resMessages = await fetch(`${API_URL}/api/auth/messages`, { headers });
        const dataMessages = await resMessages.json();
        if (!resMessages.ok) throw new Error(dataMessages.message);
        setMessages(dataMessages);

      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      }
    };

    fetchData();
  }, [user]);

  if (user?.role !== 'admin') {
    return <h2 style={{ textAlign: 'center', marginTop: '4rem' }}>Acceso Denegado</h2>;
  }

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: 'auto' }}>
      <h2>Panel de Administrador</h2>
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', maxHeight: '500px', overflowY: 'auto' }}>
          <h3>Usuarios ({users.length})</h3>
          <ul style={{ listStyle: 'none', marginTop: '1rem' }}>
            {users.map((u) => (
              <li key={u._id} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                <strong>{u.name}</strong> ({u.role})<br/>
                <small style={{ color: 'var(--text-secondary)' }}>{u.email}</small>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel" style={{ flex: 2, padding: '1.5rem', maxHeight: '500px', overflowY: 'auto' }}>
          <h3>Historial Global de Mensajes ({messages.length})</h3>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((m) => (
              <div key={m._id} style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)' }}>De: {m.sender?.name} ({m.sender?.role})</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)' }}>Para: {m.receiver?.name}</span>
                </div>
                <p>{m.content}</p>
                <small style={{ color: 'var(--text-secondary)', display: 'block', textAlign: 'right', marginTop: '0.5rem' }}>
                  {new Date(m.createdAt).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
