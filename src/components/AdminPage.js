import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:5000/api';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Helper for API requests
  const apiRequest = useCallback(async (endpoint, method = 'GET', data = null) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const config = { method, headers };
      if (data) config.body = JSON.stringify(data);
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401 && result.error === 'Token expired') {
          await handleTokenRefresh();
          return apiRequest(endpoint, method, data); // Retry with new token
        }
        throw new Error(result.error || result.errors?.join(', ') || 'Request failed');
      }
      return result;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle token refresh
  const handleTokenRefresh = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');
      const data = await apiRequest('/refresh-token', 'POST', { refreshToken });
      localStorage.setItem('token', data.token);
      return data.token;
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
      setError('Session expired. Please log in again.');
      navigate('/');
      throw err;
    }
  };

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      const data = await apiRequest('/users');
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  }, [apiRequest]);

  // Fetch all contact messages
  const fetchMessages = useCallback(async () => {
    try {
      const data = await apiRequest('/contact');
      setMessages(data);
    } catch (err) {
      setError(err.message);
    }
  }, [apiRequest]);

  // Check authentication and admin role
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      try {
        const data = await apiRequest('/protected');
        if (data.role !== 'admin') {
          setError('Admin access required');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          setIsAuthenticated(false);
          navigate('/');
        } else {
          setUser(data);
          setIsAuthenticated(true);
          fetchUsers();
          fetchMessages();
        }
      } catch (err) {
        setError('Please log in as an admin');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate, apiRequest, fetchUsers, fetchMessages]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }
    try {
      const data = await apiRequest('/admin/login', 'POST', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      const userData = await apiRequest('/protected');
      if (userData.role !== 'admin') {
        setError('Admin access required');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        navigate('/');
      } else {
        setUser(userData);
        setIsAuthenticated(true);
        setSuccess('✅ Login successful');
        setEmail('');
        setPassword('');
        fetchUsers();
        fetchMessages();
      }
    } catch (err) {
      setError(err.message === 'Too many login attempts' ? 'Too many login attempts. Try again later.' : err.message);
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      await apiRequest('/admin/register', 'POST', { name, email, password, role: 'admin' });
      setSuccess('✅ Registration successful. Please log in.');
      setShowRegister(false);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch single user
  const fetchUser = async (id) => {
    try {
      const data = await apiRequest(`/users/${id}`);
      setSelectedUser(data);
      setIsEditingUser(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update user
  const updateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (!name || !email) {
      setError('Name and email are required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }
    if (password && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      const data = { name, email };
      if (password) data.password = password;
      await apiRequest(`/users/${selectedUser.id}`, 'PATCH', data);
      setSuccess('✅ User updated successfully');
      setIsEditingUser(false);
      fetchUsers();
      fetchUser(selectedUser.id);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setError('');
    setSuccess('');
    try {
      await apiRequest(`/users/${id}`, 'DELETE');
      setSuccess('✅ User deleted successfully');
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch single message
  const fetchMessage = async (id) => {
    try {
      const data = await apiRequest(`/contact/${id}`);
      setSelectedMessage(data);
      setIsEditingMessage(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update message
  const updateMessage = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;
    if (!name || !email || !message) {
      setError('All fields are required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }
    if (message.length < 10) {
      setError('Message must be at least 10 characters');
      return;
    }
    try {
      const data = { name, email, message };
      await apiRequest(`/contact/${selectedMessage.id}`, 'PATCH', data);
      setSuccess('✅ Message updated successfully');
      setIsEditingMessage(false);
      fetchMessages();
      fetchMessage(selectedMessage.id);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete message
  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    setError('');
    setSuccess('');
    try {
      await apiRequest(`/contact/${id}`, 'DELETE');
      setSuccess('✅ Message deleted successfully');
      setSelectedMessage(null);
      fetchMessages();
    } catch (err) {
      setError(err.message);
    }
  };

  // Logout
  const logout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
      setSuccess('✅ Logged out successfully');
    }
  };

  // Reusable component for alerts
  const Alert = ({ type, message }) => (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {message}
      <button
        type="button"
        className="btn-close"
        onClick={() => type === 'danger' ? setError('') : setSuccess('')}
        aria-label="Close"
      ></button>
    </div>
  );

  // Conditional rendering
  if (!isAuthenticated) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">
                  {showRegister ? 'Admin Registration' : 'Admin Login'}
                </h2>
                {error && <Alert type="danger" message={error} />}
                {success && <Alert type="success" message={success} />}
                {isLoading && <div className="text-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>}
                {showRegister ? (
                  <form onSubmit={handleRegister} noValidate>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input
                        id="name"
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        aria-required="true"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        id="email"
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-required="true"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        id="password"
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-required="true"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-3" disabled={isLoading}>
                      {isLoading ? 'Registering...' : 'Register'}
                    </button>
                    <p className="text-center">
                      Already have an account?{' '}
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={() => setShowRegister(false)}
                        aria-label="Switch to login"
                      >
                        Login
                      </button>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleLogin} noValidate>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        id="email"
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-required="true"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        id="password"
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-required="true"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-3" disabled={isLoading}>
                      {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    <p className="text-center">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={() => setShowRegister(true)}
                        aria-label="Switch to register"
                      >
                        Register
                      </button>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reusable component for user/message list item
  const ListItem = ({ item, isSelected, onClick, type }) => (
    <li
      className={`list-group-item ${isSelected ? 'active' : ''}`}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{ cursor: 'pointer' }}
      tabIndex={0}
      role="button"
      aria-current={isSelected ? 'true' : 'false'}
      aria-label={`Select ${type} ${item.name}`}
    >
      <div>{item.name}</div>
      <small className="text-muted">{item.email}</small>
      {type === 'message' && (
        <small className="text-muted d-block">{item.message.substring(0, 50)}...</small>
      )}
    </li>
  );

  // Dashboard for authenticated admin users
  return (
    <div className="container mt-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Admin Dashboard</h1>
        <div>
          <span className="me-3" aria-label={`Welcome, ${user.name}`}>Welcome, {user.name}</span>
          <button className="btn btn-danger" onClick={logout} aria-label="Log out">
            Logout
          </button>
        </div>
      </header>

      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
            role="tab"
            aria-selected={activeTab === 'users'}
            aria-controls="users-panel"
          >
            Users
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
            role="tab"
            aria-selected={activeTab === 'messages'}
            aria-controls="messages-panel"
          >
            Contact Messages
          </button>
        </li>
      </ul>

      {error && <Alert type="danger" message={error} />}
      {success && <Alert type="success" message={success} />}
      {isLoading && <div className="text-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>}

      <div className="row">
        {activeTab === 'users' ? (
          <>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Users</h5>
                  <ul className="list-group" role="list">
                    {users.map((u) => (
                      <ListItem
                        key={u.id}
                        item={u}
                        isSelected={selectedUser?.id === u.id}
                        onClick={() => fetchUser(u.id)}
                        type="user"
                      />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  {selectedUser ? (
                    <>
                      <h5 className="card-title">User Details</h5>
                      {isEditingUser ? (
                        <form id="edit-user-form" onSubmit={updateUser} noValidate>
                          <div className="mb-3">
                            <label htmlFor="editName" className="form-label">Name</label>
                            <input
                              id="editName"
                              type="text"
                              name="name"
                              defaultValue={selectedUser.name}
                              className="form-control"
                              required
                              aria-required="true"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="editEmail" className="form-label">Email</label>
                            <input
                              id="editEmail"
                              type="email"
                              name="email"
                              defaultValue={selectedUser.email}
                              className="form-control"
                              required
                              aria-required="true"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="editPassword" className="form-label">New Password (optional)</label>
                            <input
                              id="editPassword"
                              type="password"
                              name="password"
                              className="form-control"
                              placeholder="Enter new password"
                              aria-describedby="passwordHelp"
                            />
                            <div id="passwordHelp" className="form-text">Leave blank to keep current password.</div>
                          </div>
                          <button type="submit" className="btn btn-primary me-2" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setIsEditingUser(false)}
                            aria-label="Cancel edit"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <div>
                          <p><strong>Name:</strong> {selectedUser.name}</p>
                          <p><strong>Email:</strong> {selectedUser.email}</p>
                          <p><strong>Created At:</strong> {new Date(selectedUser.created_at).toLocaleString()}</p>
                          <button
                            className="btn btn-primary me-2"
                            onClick={() => setIsEditingUser(true)}
                            aria-label={`Edit ${selectedUser.name}`}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteUser(selectedUser.id)}
                            disabled={isLoading}
                            aria-label={`Delete ${selectedUser.name}`}
                          >
                            {isLoading ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-muted" role="alert">
                      Select a user to view details
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Contact Messages</h5>
                  <ul className="list-group" role="list">
                    {messages.map((m) => (
                      <ListItem
                        key={m.id}
                        item={m}
                        isSelected={selectedMessage?.id === m.id}
                        onClick={() => fetchMessage(m.id)}
                        type="message"
                      />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  {selectedMessage ? (
                    <>
                      <h5 className="card-title">Message Details</h5>
                      {isEditingMessage ? (
                        <form id="edit-message-form" onSubmit={updateMessage} noValidate>
                          <div className="mb-3">
                            <label htmlFor="msgName" className="form-label">Name</label>
                            <input
                              id="msgName"
                              type="text"
                              name="name"
                              defaultValue={selectedMessage.name}
                              className="form-control"
                              required
                              aria-required="true"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="msgEmail" className="form-label">Email</label>
                            <input
                              id="msgEmail"
                              type="email"
                              name="email"
                              defaultValue={selectedMessage.email}
                              className="form-control"
                              required
                              aria-required="true"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="msgMessage" className="form-label">Message</label>
                            <textarea
                              id="msgMessage"
                              name="message"
                              defaultValue={selectedMessage.message}
                              className="form-control"
                              required
                              rows="5"
                              aria-required="true"
                            />
                          </div>
                          <button type="submit" className="btn btn-primary me-2" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary me-2"
                              onClick={() => setIsEditingMessage(false)}
                              aria-label="Cancel edit"
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteMessage(selectedMessage.id)}
                            disabled={isLoading}
                            aria-label={`Delete message from ${selectedMessage.name}`}
                          >
                            {isLoading ? 'Deleting...' : 'Delete'}
                          </button>
                        </form>
                      ) : (
                        <div>
                          <p><strong>Name:</strong> {selectedMessage.name}</p>
                          <p><strong>Email:</strong> {selectedMessage.email}</p>
                          <p><strong>Message:</strong> {selectedMessage.message}</p>
                          <p><strong>Created At:</strong> {new Date(selectedMessage.created_at).toLocaleString()}</p>
                          <button
                            className="btn btn-primary me-2"
                            onClick={() => setIsEditingMessage(true)}
                            aria-label={`Edit message from ${selectedMessage.name}`}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteMessage(selectedMessage.id)}
                            disabled={isLoading}
                            aria-label={`Delete message from ${selectedMessage.name}`}
                          >
                            {isLoading ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-muted" role="alert">
                      Select a message to view details
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;