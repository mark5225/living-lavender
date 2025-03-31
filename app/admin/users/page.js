// app/admin/users/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminRoute from '@/components/routing/AdminRoute';
import styles from '../admin.module.css';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filter]);

  const fetchUsers = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // In a real app, you'd fetch from your API with proper endpoints for filtering
      // For demo, simulate API call
      setTimeout(() => {
        const demoUsers = [
          { id: 1, email: 'admin@example.com', firstName: 'Admin', lastName: 'User', role: 'admin', membershipType: 'premium', createdAt: new Date().toISOString() },
          { id: 2, email: 'john@example.com', firstName: 'John', lastName: 'Doe', role: 'user', membershipType: 'premium', createdAt: new Date().toISOString() },
          { id: 3, email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith', role: 'user', membershipType: 'basic', createdAt: new Date().toISOString() },
          ...Array.from({ length: 20 }, (_, i) => ({
            id: i + 4,
            email: `demo${i}@example.com`,
            firstName: ['Sarah', 'Michael', 'David', 'Emma', 'Tom'][i % 5],
            lastName: ['Johnson', 'Williams', 'Brown', 'Davis', 'Miller'][i % 5],
            role: 'user',
            membershipType: ['demo', 'basic', 'premium'][i % 3],
            createdAt: new Date(Date.now() - i * 86400000).toISOString() // Subtract days
          }))
        ];
        
        // Filter users based on selected filter
        let filteredUsers = demoUsers;
        if (filter !== 'all') {
          filteredUsers = demoUsers.filter(user => user.membershipType === filter);
        }
        
        // Calculate total pages
        const total = Math.ceil(filteredUsers.length / usersPerPage);
        setTotalPages(total);
        
        // Paginate
        const start = (currentPage - 1) * usersPerPage;
        const paginatedUsers = filteredUsers.slice(start, start + usersPerPage);
        
        setUsers(paginatedUsers);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Failed to fetch users data.' });
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    setConfirmDelete(userId);
  };

  const confirmDeleteUser = async () => {
    if (!confirmDelete) return;
    
    try {
      // In a real app, you'd call your API to delete the user
      // For demo, simulate API call
      setTimeout(() => {
        // Remove user from list
        setUsers(users.filter(user => user.id !== confirmDelete));
        
        setMessage({ type: 'success', text: 'User deleted successfully.' });
        setConfirmDelete(null);
      }, 500);
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage({ type: 'error', text: 'Failed to delete user.' });
    }
  };

  const handleChangeMembership = (userId, newType) => {
    // Update user in list
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, membershipType: newType };
      }
      return user;
    }));
    
    // In a real app, you'd call your API to update the user
    
    setMessage({ type: 'success', text: `User membership updated to ${newType}.` });
  };

  const handleChangeRole = (userId, newRole) => {
    // Update user in list
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, role: newRole };
      }
      return user;
    }));
    
    // In a real app, you'd call your API to update the user
    
    setMessage({ type: 'success', text: `User role updated to ${newRole}.` });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminRoute>
      <div className={styles.adminContainer}>
        <div className="container">
          <div className={styles.adminHeader}>
            <h1>User Management</h1>
            <p>View and manage user accounts</p>
          </div>
          
          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}
          
          <div className={styles.adminToolbar}>
            <div className={styles.toolbarLeft}>
              <Link href="/admin" className={styles.backLink}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Dashboard
              </Link>
            </div>
            
            <div className={styles.toolbarRight}>
              <div className={styles.filterGroup}>
                <label>Filter:</label>
                <select 
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}
                  className={styles.filterSelect}
                >
                  <option value="all">All Users</option>
                  <option value="basic">Basic Members</option>
                  <option value="premium">Premium Members</option>
                  <option value="demo">Demo Users</option>
                </select>
              </div>
              
              <Link href="/admin/users/create" className="btn btn-primary">
                Add New User
              </Link>
            </div>
          </div>
          
          <div className={styles.contentCard}>
            {loading ? (
              <div className={styles.loadingIndicator}>
                <div className={styles.spinner}></div>
                <p>Loading users...</p>
              </div>
            ) : (
              <>
                <div className={styles.tableContainer}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Membership</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="7" className={styles.noResults}>No users found</td>
                        </tr>
                      ) : (
                        users.map(user => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>
                              <select 
                                value={user.role}
                                onChange={(e) => handleChangeRole(user.id, e.target.value)}
                                className={styles.roleSelect}
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td>
                              <select 
                                value={user.membershipType}
                                onChange={(e) => handleChangeMembership(user.id, e.target.value)}
                                className={styles.membershipSelect}
                              >
                                <option value="basic">Basic</option>
                                <option value="premium">Premium</option>
                                <option value="demo">Demo</option>
                              </select>
                            </td>
                            <td>{formatDate(user.createdAt)}</td>
                            <td className={styles.actionButtons}>
                              <Link 
                                href={`/admin/users/${user.id}`}
                                className={styles.viewButton}
                                title="View user details"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                              </Link>
                              <Link 
                                href={`/admin/users/${user.id}/edit`}
                                className={styles.editButton}
                                title="Edit user"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </Link>
                              <button 
                                className={styles.deleteButton}
                                onClick={() => handleDeleteUser(user.id)}
                                title="Delete user"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={styles.paginationButton}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                      Previous
                    </button>
                    
                    <span className={styles.paginationInfo}>
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={styles.paginationButton}
                    >
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Delete confirmation modal */}
          {confirmDelete && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                <div className={styles.modalActions}>
                  <button 
                    className={styles.cancelButton}
                    onClick={() => setConfirmDelete(null)}
                  ></button>