import React, { useState } from 'react';
import './UserM.css'; // Create a CSS file for styling

const UserM = () => {
  // Sample user data (replace with your actual data source)
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', password: 'password123' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', password: 'secretpassword' },
  ]);

  return (
    <div className="user-management">
      <h2>User Management</h2>

      <div className="user-list-container">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Password: {user.password}</p> 
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserM;