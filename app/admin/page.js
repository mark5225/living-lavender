// app/admin/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [demoUserCount, setDemoUserCount] = useState(1);
  const [generatingUsers, setGeneratingUsers] = useState(false);
  const [userList, setUserList] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Check if user is admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    } else if (!loading && user) {
      // Fetch existing users
      fetchUsers();
    }
  }, [user, loading, router]);

  const fetchUsers = async () => {
    try {
      // In a real app, fetch from API
      // For demo, we'll simulate this
      setTimeout(() => {
        setUserList([
          { id: 1, email: 'admin@example.com', firstName: 'Admin', lastName: 'User', role: 'admin', membershipType: 'premium' },
          { id: 2, email: 'user1@example.com', firstName: 'John', lastName: 'Doe', role: 'user', membershipType: 'premium' },
          { id: 3, email: 'user2@example.com', firstName: 'Jane', lastName: 'Smith', role: 'user', membershipType: 'basic' },
          { id: 4, email: 'demo1@example.com', firstName: 'Demo', lastName: 'User1', role: 'user', membershipType: 'demo' }
        ]);
      }, 500);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Failed to fetch users' });
    }
  };

  const generateDemoUsers = async () => {
    setGeneratingUsers(true);
    setMessage({ type: '', text: '' });
    
    try {
      // In a real app, this would be an API call
      // For demo, simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample success response
      setMessage({ 
        type: 'success', 
        text: `Successfully generated ${demoUserCount} demo user${demoUserCount > 1 ? 's' : ''}!` 
      });
      
      // Refresh user list
      fetchUsers();
    } catch (error) {
      console.error('Error generating demo users:', error);
      setMessage({ type: 'error', text: 'Failed to generate demo users' });
    } finally {
      setGeneratingUsers(false);
    }
  };

  const handleMembershipChange = (userId, newType) => {
    // In a real app, this would update via API
    setUserList(userList.map(user => {
      if (user.id === userId) {
        return { ...user, membershipType: newType };
      }
      return user;
    }));
    
    setMessage({ 
      type: 'success', 
      text: `Updated user membership to ${newType}` 
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className={styles.adminContainer}>
      <div className="container">
        <div className={styles.adminHeader}>
          <h1>Admin Dashboard</h1>
          <p>Manage users and site content</p>
        </div>
        
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <div className={styles.adminContent}>
          <div className={styles.adminCard}>
            <h2>Generate Demo Users</h2>
            <p>
              Create demo users with randomized profiles for testing. 
              Demo users are clearly marked and cannot interact with real users.
            </p>
            
            <div className={styles.generateForm}>
              <div className={styles.formGroup}>
                <label htmlFor="demoUserCount">Number of users:</label>
                <input
                  type="number"
                  id="demoUserCount"
                  min="1"
                  max="50"
                  value={demoUserCount}
                  onChange={(e) => setDemoUserCount(parseInt(e.target.value))}
                  className={styles.countInput}
                />
              </div>
              
              <button 
                className={`btn btn-primary ${styles.generateBtn}`}
                onClick={generateDemoUsers}
                disabled={generatingUsers}
              >
                {generatingUsers ? 'Generating...' : 'Generate Demo Users'}
              </button>
            </div>
          </div>
          
          <div className={styles.adminCard}>
            <h2>User Management</h2>
            <div className={styles.tableContainer}>
              <table className={styles.userTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Membership</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <select 
                          value={user.membershipType}
                          onChange={(e) => handleMembershipChange(user.id, e.target.value)}
                          className={styles.membershipSelect}
                        >
                          <option value="basic">Basic</option>
                          <option value="premium">Premium</option>
                          <option value="demo">Demo</option>
                        </select>
                      </td>
                      <td>
                        <button className={styles.viewBtn}>View</button>
                        <button className={styles.deleteBtn}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}