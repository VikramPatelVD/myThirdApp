import React from "react";

function UserList({ users, onEdit, onDelete }) {
  if (users.length === 0) return <p>No users registered yet.</p>;

  return (
    <div>
      <h2>Registered Users</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#D6E4F0', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Name</th>
            <th style={{ padding: '10px' }}>Email</th>
            <th style={{ padding: '10px' }}>Phone</th>
            <th style={{ padding: '10px' }}>City</th>
            <th style={{ padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{user.name}</td>
              <td style={{ padding: '10px' }}>{user.email}</td>
              <td style={{ padding: '10px' }}>{user.phone}</td>
              <td style={{ padding: '10px' }}>{user.city}</td>
              <td style={{ padding: '10px' }}>
                <button onClick={() => onEdit(user)} style={{ marginRight: '5px', color: 'blue', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => onDelete(user.id)} style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;