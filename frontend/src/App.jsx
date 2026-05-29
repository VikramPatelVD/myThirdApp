import { useState, useEffect } from "react";
import UserForm from "./UserForm";
import UserList from "./UserList";

// Base URL of your C# API
const API = "http://localhost:5000/api/users";

function App() {

  // ── STATE ────────────────────────────────────────────────────
  // useState stores data. When it changes, React re-renders the page.
  const [users, setUsers]         = useState([]);   // array of all users
  const [editingUser, setEditing] = useState(null); // null=create, obj=edit
  const [message, setMessage]     = useState('');   // status message text
  const [msgColor, setMsgColor]   = useState('green');

  // ── LOAD ALL USERS FROM API ───────────────────────────────────
  // Calls GET /api/users and stores result in users state
  const loadUsers = async () => {
    try {
      const res  = await fetch(API);
      const data = await res.json();  // convert response to JS array
      setUsers(data);                 // triggers re-render of UserList
    } catch {
      showMsg('Cannot connect to backend. Is dotnet run running?', 'red');
    }
  };

  // useEffect with [] runs once when the page first loads
  useEffect(() => {
    loadUsers();
  }, []);  // [] = only run once. [someVar] = run when someVar changes

  // ── SHOW STATUS MESSAGE ───────────────────────────────────────
  const showMsg = (text, color = 'green') => {
    setMsgColor(color);
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);  // auto-clear after 3 sec
  };

  // ── SAVE (CREATE OR UPDATE) ───────────────────────────────────
  // Called by UserForm when Register/Update button is clicked
  const handleSave = async (formData) => {
    if (editingUser) {
      // UPDATE — PUT request
      const res = await fetch(`${API}/${editingUser.id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),  // send form data as JSON
      });
      res.ok ? showMsg('User updated!') : showMsg('Update failed.','red');
    } else {
      // CREATE — POST request
      const res = await fetch(API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),
      });
      res.ok ? showMsg('User registered!') : showMsg('Failed.','red');
    }
    setEditing(null);  // clear edit mode — form goes back to create
    loadUsers();       // refresh the table
  };

  // ── EDIT ──────────────────────────────────────────────────────
  // Called when Edit button clicked in the table
  const handleEdit = (user) => {
    setEditing(user);  // puts the form into edit mode with user's data
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── DELETE ────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    res.ok ? showMsg('User deleted.') : showMsg('Delete failed.','red');
    loadUsers();
  };

  // ── RENDER ───────────────────────────────────────────────────
  return (
    <div style={{ maxWidth:'850px', margin:'30px auto',
                  fontFamily:'Arial', padding:'0 20px' }}>

      <h1 style={{ borderBottom:'2px solid #1F4E79',
                   paddingBottom:'10px', color:'#1F4E79' }}>
        User Registration — CRUD Demo
      </h1>

      {/* Status message — only shows when message is not empty */}
      {message && (
        <p style={{
          color: msgColor,
          border: `1px solid ${msgColor}`,
          padding: '10px', borderRadius: '4px',
          background: msgColor === 'green' ? '#f0fff0' : '#fff0f0'
        }}>
          {message}
        </p>
      )}

      {/* Registration / Edit Form */}
      <UserForm
        editingUser={editingUser}
        onSave={handleSave}
        onCancel={() => { setEditing(null); setMessage(''); }}
      />

      <hr style={{ margin: '30px 0', borderColor: '#1F4E79' }} />

      {/* Users Table */}
      <UserList
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

    </div>
  );
}

export default App;
