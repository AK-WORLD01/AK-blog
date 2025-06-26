import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Tabs, Tab, Alert, Table, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

const apiRequest = async (url, options = {}) => {
  let token = localStorage.getItem('token');
  let refreshToken = localStorage.getItem('refreshToken');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers }
    });

    if (response.status === 401) {
      const error = await response.json();
      if (error.error === 'Token expired' && refreshToken) {
        const refreshResponse = await fetch('https://akera-q9qk.onrender.com/api/refresh-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });

        if (refreshResponse.ok) {
          const { token: newToken } = await refreshResponse.json();
          localStorage.setItem('token', newToken);
          return apiRequest(url, {
            ...options,
            headers: { ...options.headers, 'Authorization': `Bearer ${newToken}` }
          });
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          throw new Error('Session expired. Please log in again.');
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        throw new Error('Invalid token');
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Request failed');
    }

    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [postForm, setPostForm] = useState({ id: '', title: '', excerpt: '', content: '', category: '', image: '' });
  const [newsForm, setNewsForm] = useState({ id: '', title: '', summary: '', source: '' });
  const [trendingForm, setTrendingForm] = useState({ id: '', title: '', summary: '', source: '' });
  const [posts, setPosts] = useState([]);
  const [news, setNews] = useState([]);
  const [trending, setTrending] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [isEditingTrending, setIsEditingTrending] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loadingTab, setLoadingTab] = useState({ posts: false, news: false, trending: false });
  const navigate = useNavigate();
  const postFormRef = useRef(null);
  const newsFormRef = useRef(null);
  const trendingFormRef = useRef(null);

  const validateForm = (formType, formData) => {
    const errors = {};
    if (formType === 'post') {
      if (!formData.title.trim()) errors.title = 'Title is required';
      if (!formData.excerpt.trim()) errors.excerpt = 'Excerpt is required';
      if (!formData.content.trim()) errors.content = 'Content is required';
      if (!formData.category.trim()) errors.category = 'Category is required';
    } else if (formType === 'news' || formType === 'trending') {
      if (!formData.title.trim()) errors.title = 'Title is required';
      if (!formData.summary.trim()) errors.summary = 'Summary is required';
      if (!formData.source.trim()) errors.source = 'Source is required';
    }
    return errors;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !storedUser) {
      navigate('/auth');
      return;
    }

    setUser(JSON.parse(storedUser));

    const verifyToken = async () => {
      try {
        const data = await apiRequest('https://akera-q9qk.onrender.com/api/protected');
        setUser(data);
        setLoadingTab(prev => ({ ...prev, posts: true, news: true, trending: true }));
        const [userPosts, userNews, userTrending] = await Promise.all([
          apiRequest(`https://akera-q9qk.onrender.com/api/posts?userId=${data.id}`),
          apiRequest(`https://akera-q9qk.onrender.com/api/news?userId=${data.id}`),
          apiRequest(`https://akera-q9qk.onrender.com/api/trending?userId=${data.id}`)
        ]);
        setPosts(userPosts.filter(post => post.user_id === data.id));
        setNews(userNews.filter(item => item.user_id === data.id));
        setTrending(userTrending.filter(item => item.user_id === data.id));
      } catch (err) {
        setError('Session expired or invalid. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/auth'), 2000);
      } finally {
        setIsLoading(false);
        setLoadingTab({ posts: false, news: false, trending: false });
      }
    };

    verifyToken();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const handleFormChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'post') {
      setPostForm(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'news') {
      setNewsForm(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'trending') {
      setTrendingForm(prev => ({ ...prev, [name]: value }));
    }
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEditPost = (post) => {
    setPostForm({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      image: post.image || ''
    });
    setIsEditing(true);
    postFormRef.current?.focus();
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await apiRequest(`https://akera-q9qk.onrender.com/api/posts/${id}`, { method: 'DELETE' });
      setPosts(posts.filter(post => post.id !== id));
      setSuccess('Post deleted successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditNews = (item) => {
    setNewsForm({
      id: item.id,
      title: item.title,
      summary: item.summary,
      source: item.source
    });
    setIsEditingNews(true);
    newsFormRef.current?.focus();
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) return;
    try {
      await apiRequest(`https://akera-q9qk.onrender.com/api/news/${id}`, { method: 'DELETE' });
      setNews(news.filter(item => item.id !== id));
      setSuccess('News item deleted successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditTrending = (item) => {
    setTrendingForm({
      id: item.id,
      title: item.title,
      summary: item.summary,
      source: item.source
    });
    setIsEditingTrending(true);
    trendingFormRef.current?.focus();
  };

  const handleDeleteTrending = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trending item?')) return;
    try {
      await apiRequest(`https://akera-q9qk.onrender.com/api/trending/${id}`, { method: 'DELETE' });
      setTrending(trending.filter(item => item.id !== id));
      setSuccess('Trending item deleted successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    let endpoint, data, method;

    if (formType === 'post') {
      const errors = validateForm('post', postForm);
      if (Object.keys(errors).length) {
        setFormErrors(errors);
        return;
      }
      if (isEditing) {
        endpoint = `/api/posts/${postForm.id}`;
        method = 'PATCH';
        data = { ...postForm, userId: user.id };
      } else {
        endpoint = '/api/posts';
        method = 'POST';
        data = { ...postForm, userId: user.id };
      }
    } else if (formType === 'news') {
      const errors = validateForm('news', newsForm);
      if (Object.keys(errors).length) {
        setFormErrors(errors);
        return;
      }
      if (isEditingNews) {
        endpoint = `/api/news/${newsForm.id}`;
        method = 'PATCH';
        data = { ...newsForm, userId: user.id };
      } else {
        endpoint = '/api/news';
        method = 'POST';
        data = { ...newsForm, userId: user.id };
      }
    } else if (formType === 'trending') {
      const errors = validateForm('trending', trendingForm);
      if (Object.keys(errors).length) {
        setFormErrors(errors);
        return;
      }
      if (isEditingTrending) {
        endpoint = `/api/trending/${trendingForm.id}`;
        method = 'PATCH';
        data = { ...trendingForm, userId: user.id };
      } else {
        endpoint = '/api/trending';
        method = 'POST';
        data = { ...trendingForm, userId: user.id };
      }
    }

    try {
      await apiRequest(`https://akera-q9qk.onrender.com${endpoint}`, {
        method,
        body: JSON.stringify(data)
      });
      setSuccess(`${isEditing || isEditingNews || isEditingTrending ? 'Item updated' : formType.charAt(0).toUpperCase() + formType.slice(1) + ' submitted'} successfully!`);
      if (formType === 'post') {
        setPostForm({ id: '', title: '', excerpt: '', content: '', category: '', image: '' });
        setIsEditing(false);
        setLoadingTab(prev => ({ ...prev, posts: true }));
        const userPosts = await apiRequest(`https://akera-q9qk.onrender.com/api/posts?userId=${user.id}`);
        setPosts(userPosts.filter(post => post.user_id === user.id));
      } else if (formType === 'news') {
        setNewsForm({ id: '', title: '', summary: '', source: '' });
        setIsEditingNews(false);
        setLoadingTab(prev => ({ ...prev, news: true }));
        const userNews = await apiRequest(`https://akera-q9qk.onrender.com/api/news?userId=${user.id}`);
        setNews(userNews.filter(item => item.user_id === user.id));
      } else if (formType === 'trending') {
        setTrendingForm({ id: '', title: '', summary: '', source: '' });
        setIsEditingTrending(false);
        setLoadingTab(prev => ({ ...prev, trending: true }));
        const userTrending = await apiRequest(`https://akera-q9qk.onrender.com/api/trending?userId=${user.id}`);
        setTrending(userTrending.filter(item => item.user_id === user.id));
      }
      setFormErrors({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingTab(prev => ({ ...prev, [formType]: false }));
    }
  };

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="dashboard-container my-5" role="main">
      <Row>
        <Col lg={10} className="mx-auto">
          <Card className="dashboard-card shadow-sm">
            <Card.Body>
              <h1 className="mb-4">User Dashboard</h1>
              {error && <Alert variant="danger" role="alert">{error}</Alert>}
              {success && <Alert variant="success" role="alert">{success}</Alert>}
              {user && (
                <>
                  <Card className="mb-4">
                    <Card.Body>
                      <h2>Welcome, {user.name}!</h2>
                      <p><strong>Email:</strong> {user.email}</p>
                      <Button variant="danger" onClick={handleLogout} aria-label="Logout">
                        Logout
                      </Button>
                    </Card.Body>
                  </Card>

                  <Tabs defaultActiveKey="post" id="content-tabs" className="mb-3">
                    <Tab eventKey="post" title={isEditing ? 'Edit Post' : 'Add Recent Post'}>
                      <Form onSubmit={e => handleSubmit(e, 'post')} ref={postFormRef} aria-labelledby="post-form-title">
                        <h3 id="post-form-title" className="visually-hidden">Add or Edit Post</h3>
                        <Form.Group className="mb-3" controlId="post-title">
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            value={postForm.title}
                            onChange={e => handleFormChange(e, 'post')}
                            isInvalid={!!formErrors.title}
                            required
                            aria-describedby="title-error"
                          />
                          <Form.Control.Feedback type="invalid" id="title-error">{formErrors.title}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="post-excerpt">
                          <Form.Label>Excerpt</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="excerpt"
                            value={postForm.excerpt}
                            onChange={e => handleFormChange(e, 'post')}
                            rows={3}
                            isInvalid={!!formErrors.excerpt}
                            required
                            aria-describedby="excerpt-error"
                          />
                          <Form.Control.Feedback type="invalid" id="excerpt-error">{formErrors.excerpt}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="post-content">
                          <Form.Label>Content</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="content"
                            value={postForm.content}
                            onChange={e => handleFormChange(e, 'post')}
                            rows={5}
                            isInvalid={!!formErrors.content}
                            required
                            aria-describedby="content-error"
                          />
                          <Form.Control.Feedback type="invalid" id="content-error">{formErrors.content}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="post-category">
                          <Form.Label>Category</Form.Label>
                          <Form.Control
                            type="text"
                            name="category"
                            value={postForm.category}
                            onChange={e => handleFormChange(e, 'post')}
                            isInvalid={!!formErrors.category}
                            required
                            aria-describedby="category-error"
                          />
                          <Form.Control.Feedback type="invalid" id="category-error">{formErrors.category}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="post-image">
                          <Form.Label>Image URL (Optional)</Form.Label>
                          <Form.Control
                            type="text"
                            name="image"
                            value={postForm.image}
                            onChange={e => handleFormChange(e, 'post')}
                          />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="me-2" disabled={loadingTab.posts}>
                          {loadingTab.posts ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              {isEditing ? 'Updating...' : 'Submitting...'}
                            </>
                          ) : (
                            isEditing ? 'Update Post' : 'Submit Post'
                          )}
                        </Button>
                        {isEditing && (
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setPostForm({ id: '', title: '', excerpt: '', content: '', category: '', image: '' });
                              setIsEditing(false);
                              setFormErrors({});
                            }}
                            aria-label="Cancel editing post"
                          >
                            Cancel
                          </Button>
                        )}
                      </Form>
                    </Tab>
                    <Tab eventKey="news" title={isEditingNews ? 'Edit Tech News' : 'Add Tech News'}>
                      <Form onSubmit={e => handleSubmit(e, 'news')} ref={newsFormRef} aria-labelledby="news-form-title">
                        <h3 id="news-form-title" className="visually-hidden">Add or Edit Tech News</h3>
                        <Form.Group className="mb-3" controlId="news-title">
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            value={newsForm.title}
                            onChange={e => handleFormChange(e, 'news')}
                            isInvalid={!!formErrors.title}
                            required
                            aria-describedby="news-title-error"
                          />
                          <Form.Control.Feedback type="invalid" id="news-title-error">{formErrors.title}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="news-summary">
                          <Form.Label>Summary</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="summary"
                            value={newsForm.summary}
                            onChange={e => handleFormChange(e, 'news')}
                            rows={3}
                            isInvalid={!!formErrors.summary}
                            required
                            aria-describedby="news-summary-error"
                          />
                          <Form.Control.Feedback type="invalid" id="news-summary-error">{formErrors.summary}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="news-source">
                          <Form.Label>Source</Form.Label>
                          <Form.Control
                            type="text"
                            name="source"
                            value={newsForm.source}
                            onChange={e => handleFormChange(e, 'news')}
                            isInvalid={!!formErrors.source}
                            required
                            aria-describedby="news-source-error"
                          />
                          <Form.Control.Feedback type="invalid" id="news-source-error">{formErrors.source}</Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="me-2" disabled={loadingTab.news}>
                          {loadingTab.news ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              {isEditingNews ? 'Updating...' : 'Submitting...'}
                            </>
                          ) : (
                            isEditingNews ? 'Update News' : 'Submit News'
                          )}
                        </Button>
                        {isEditingNews && (
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setNewsForm({ id: '', title: '', summary: '', source: '' });
                              setIsEditingNews(false);
                              setFormErrors({});
                            }}
                            aria-label="Cancel editing news"
                          >
                            Cancel
                          </Button>
                        )}
                      </Form>
                    </Tab>
                    <Tab eventKey="trending" title={isEditingTrending ? 'Edit Trending Tech' : 'Add Trending Tech'}>
                      <Form onSubmit={e => handleSubmit(e, 'trending')} ref={trendingFormRef} aria-labelledby="trending-form-title">
                        <h3 id="trending-form-title" className="visually-hidden">Add or Edit Trending Tech</h3>
                        <Form.Group className="mb-3" controlId="trending-title">
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            value={trendingForm.title}
                            onChange={e => handleFormChange(e, 'trending')}
                            isInvalid={!!formErrors.title}
                            required
                            aria-describedby="trending-title-error"
                          />
                          <Form.Control.Feedback type="invalid" id="trending-title-error">{formErrors.title}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="trending-summary">
                          <Form.Label>Summary</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="summary"
                            value={trendingForm.summary}
                            onChange={e => handleFormChange(e, 'trending')}
                            rows={3}
                            isInvalid={!!formErrors.summary}
                            required
                            aria-describedby="trending-summary-error"
                          />
                          <Form.Control.Feedback type="invalid" id="trending-summary-error">{formErrors.summary}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="trending-source">
                          <Form.Label>Source</Form.Label>
                          <Form.Control
                            type="text"
                            name="source"
                            value={trendingForm.source}
                            onChange={e => handleFormChange(e, 'trending')}
                            isInvalid={!!formErrors.source}
                            required
                            aria-describedby="trending-source-error"
                          />
                          <Form.Control.Feedback type="invalid" id="trending-source-error">{formErrors.source}</Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="me-2" disabled={loadingTab.trending}>
                          {loadingTab.trending ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              {isEditingTrending ? 'Updating...' : 'Submitting...'}
                            </>
                          ) : (
                            isEditingTrending ? 'Update Trending' : 'Submit Trending'
                          )}
                        </Button>
                        {isEditingTrending && (
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setTrendingForm({ id: '', title: '', summary: '', source: '' });
                              setIsEditingTrending(false);
                              setFormErrors({});
                            }}
                            aria-label="Cancel editing trending"
                          >
                            Cancel
                          </Button>
                        )}
                      </Form>
                    </Tab>
                    <Tab eventKey="myPosts" title="My Posts">
                      {loadingTab.posts ? (
                        <div className="text-center py-5">
                          <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        </div>
                      ) : posts.length > 0 ? (
                        <Table striped bordered hover responsive>
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Category</th>
                              <th>Created At</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {posts.map(post => (
                              <tr key={post.id}>
                                <td>{post.title}</td>
                                <td>{post.category}</td>
                                <td>{new Date(post.created_at).toLocaleDateString()}</td>
                                <td>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEditPost(post)}
                                    aria-label={`Edit post ${post.title}`}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDeletePost(post.id)}
                                    aria-label={`Delete post ${post.title}`}
                                  >
                                    Delete
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <p>No posts found. Create one in the "Add Recent Post" tab.</p>
                      )}
                    </Tab>
                    <Tab eventKey="myNews" title="My Tech News">
                      {loadingTab.news ? (
                        <div className="text-center py-5">
                          <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        </div>
                      ) : news.length > 0 ? (
                        <Table striped bordered hover responsive>
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Source</th>
                              <th>Created At</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {news.map(item => (
                              <tr key={item.id}>
                                <td>{item.title}</td>
                                <td>{item.source}</td>
                                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                                <td>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEditNews(item)}
                                    aria-label={`Edit news ${item.title}`}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDeleteNews(item.id)}
                                    aria-label={`Delete news ${item.title}`}
                                  >
                                    Delete
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <p>No tech news found. Create one in the "Add Tech News" tab.</p>
                      )}
                    </Tab>
                    <Tab eventKey="myTrending" title="My Trending Tech">
                      {loadingTab.trending ? (
                        <div className="text-center py-5">
                          <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        </div>
                      ) : trending.length > 0 ? (
                        <Table striped bordered hover responsive>
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Source</th>
                              <th>Created At</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {trending.map(item => (
                              <tr key={item.id}>
                                <td>{item.title}</td>
                                <td>{item.source}</td>
                                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                                <td>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEditTrending(item)}
                                    aria-label={`Edit trending ${item.title}`}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDeleteTrending(item.id)}
                                    aria-label={`Delete trending ${item.title}`}
                                  >
                                    Delete
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <p>No trending tech found. Create one in the "Add Trending Tech" tab.</p>
                      )}
                    </Tab>
                  </Tabs>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;