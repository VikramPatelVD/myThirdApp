import React, { useState, useEffect } from "react";
import UserForm from "./UserForm";
import UserList from "./UserList";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api/users";

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const [msgColor, setMsgColor] = useState('green');

  const loadUsers = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      showMsg('Cannot connect to backend. Is "dotnet run" running?', 'red');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showMsg = (text, color = 'green') => {
    setMsgColor(color);
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSave = async (formData) => {
    try {
      const method = editingUser ? 'PUT' : 'POST';
      const url = editingUser ? `${API}/${editingUser.id}` : API;

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showMsg(editingUser ? 'User updated!' : 'User registered!');
        setEditing(null); // Triggers form clear
        loadUsers();
      } else {
        showMsg('Save failed.', 'red');
      }
    } catch (error) {
      showMsg('Error connecting to API', 'red');
    }
  };

  const handleEdit = (user) => {
    setEditing(user);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    res.ok ? showMsg('User deleted.') : showMsg('Delete failed.', 'red');
    loadUsers();
  };

  return (
    <div style={{ maxWidth:'850px', margin:'30px auto', fontFamily:'Arial', padding:'0 20px' }}>
      <h1 style={{ borderBottom:'2px solid #1F4E79', paddingBottom:'10px', color:'#1F4E79' }}>
        User Registration — CRUD Demo
      </h1>

      {message && (
        <p style={{
          color: msgColor, border: `1px solid ${msgColor}`,
          padding: '10px', borderRadius: '4px',
          background: msgColor === 'green' ? '#f0fff0' : '#fff0f0'
        }}>
          {message}
        </p>
      )}

      <UserForm editingUser={editingUser} onSave={handleSave} onCancel={() => setEditing(null)} />
      <hr style={{ margin: '30px 0', borderColor: '#1F4E79' }} />
      <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

export default App;