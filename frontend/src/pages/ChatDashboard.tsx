import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { io, Socket } from 'socket.io-client';

interface MessageData {
  sender: string;
  receiver: string;
  content: string;
}

const ChatDashboard: React.FC = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    if (user) {
      const newSocket = io(API_URL);
      
      newSocket.on('connect', () => {
        newSocket.emit('join_chat', user._id);
      });

      newSocket.on('receive_message', (message: MessageData) => {
        setMessages((prev) => [...prev, message]);
        
        // Trigger notification if tab is hidden and message is not from self
        if (document.hidden && message.sender !== user._id && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('Nuevo mensaje - AsistenciaFinanciera', {
            body: message.content,
            icon: '/vite.svg'
          });
        }
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && currentMessage.trim() && receiverId.trim()) {
      const messageData: MessageData = {
        sender: user!._id,
        receiver: receiverId,
        content: currentMessage
      };
      
      socket.emit('send_message', messageData);
      setCurrentMessage('');
    }
  };

  return (
    <div className="glass-panel chat-dashboard">
      <div className="chat-sidebar">
        <h3>Tu Perfil</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{user?.role === 'advisor' ? 'Asesor Financiero' : 'Usuario'}</p>
        <div style={{ background: 'rgba(15,23,42,0.5)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Tu ID (compártelo para recibir mensajes):</p>
          <code style={{ color: 'var(--accent-primary)', wordBreak: 'break-all' }}>{user?._id}</code>
        </div>
        
        <div className="form-group" style={{ marginTop: 'auto' }}>
          <label>ID del Destinatario</label>
          <input 
            type="text" 
            value={receiverId} 
            onChange={(e) => setReceiverId(e.target.value)} 
            placeholder="Pega el ID aquí..."
          />
        </div>
      </div>
      
      <div className="chat-area" style={{ background: 'rgba(15, 23, 42, 0.3)', borderRadius: '1rem' }}>
        <div className="chat-header">
          <h3>Chat {receiverId ? `con ${receiverId.substring(0, 8)}...` : '(Selecciona un destinatario)'}</h3>
        </div>
        
        <div className="chat-messages">
          {messages.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
              No hay mensajes aún. Ingresa un ID de destinatario y saluda.
            </p>
          ) : (
            messages.map((msg, index) => {
              const isSent = msg.sender === user?._id;
              return (
                <div key={index} className={`message ${isSent ? 'sent' : 'received'}`}>
                  {msg.content}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form className="chat-input-area" onSubmit={sendMessage}>
          <input 
            type="text" 
            value={currentMessage} 
            onChange={(e) => setCurrentMessage(e.target.value)} 
            placeholder="Escribe un mensaje..."
            disabled={!receiverId}
          />
          <button type="submit" className="btn" disabled={!receiverId || !currentMessage.trim()} style={{ width: 'auto' }}>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatDashboard;
