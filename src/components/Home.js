import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Form, InputGroup, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [recentTechNews, setRecentTechNews] = useState([]);
  const [trendingTech, setTrendingTech] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains('dark-mode'));

  const fetchData = async (query = '') => {
    setIsLoading(true);
    setError('');

    try {
      const [postsRes, newsRes, trendingRes] = await Promise.all([
        fetch(`https://akera-q9qk.onrender.com/api/posts?search=${encodeURIComponent(query)}`),
        fetch(`https://akera-q9qk.onrender.com/api/news?search=${encodeURIComponent(query)}`),
        fetch(`https://akera-q9qk.onrender.com/api/trending?search=${encodeURIComponent(query)}`),
      ]);

      if (!postsRes.ok || !newsRes.ok || !trendingRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const posts = await postsRes.json();
      const news = await newsRes.json();
      const trending = await trendingRes.json();

      setBlogs(posts);
      setRecentTechNews(news);
      setTrendingTech(trending);
    } catch (err) {
      setError('Unable to load content. Please try again later.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen for dark-mode class changes on body
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains('dark-mode'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(searchQuery);
  };

  if (isLoading && !blogs.length) {
    return (
      <Container
        className="text-center mt-5"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="spinner-border"
          style={{
            width: '3rem',
            height: '3rem',
            color: isDarkMode ? '#a6c1ee' : '#007bff',
          }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <div
      className="home-page"
      style={{
        minHeight: '100vh',
        backgroundColor: isDarkMode ? '#121212' : '#f8f9fa',
        color: isDarkMode ? '#e9ecef' : '#343a40',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Welcome Message Section with Background Video */}
      <section
        className="welcome-section py-5 position-relative"
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, #a50e7a, #110e78)'
            : 'linear-gradient(135deg, #007bff, #6610f2)',
          overflow: 'hidden',
          minHeight: '400px',
        }}
      >
        <video
          src="https://cdn.pixabay.com/video/2019/10/09/27706-365890968_large.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isDarkMode ? 0.2 : 0.3,
            zIndex: 1,
          }}
          aria-label="Background technology video"
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
            zIndex: 2,
          }}
        ></div>
        <Container style={{ zIndex: 3, position: 'relative' }}>
          <Row className="align-items-center">
            <Col md={8}>
              <h1
                style={{
                  fontWeight: 'bold',
                  fontSize: '3.5rem',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                  color: isDarkMode ? '#e9ecef' : '#ffffff',
                }}
              >
                Welcome to AK Blog
              </h1>
              <p
                style={{
                  fontSize: '1.5rem',
                  marginBottom: '1.5rem',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                  color: isDarkMode ? '#adb5bd' : '#ffffff',
                }}
              >
                Your source for the latest in technology, web development, and programming trends.
              </p>
              <Button
                as={Link}
                to="/blogs"
                variant={isDarkMode ? 'outline-light' : 'outline-primary'}
                size="lg"
                style={{
                  borderRadius: '25px',
                  padding: '10px 30px',
                  fontWeight: 500,
                  position: 'relative',
                  overflow: 'hidden',
                  zIndex: 1,
                  background: isDarkMode ? 'transparent' : '#fff',
                  color: isDarkMode ? '#e9ecef' : '#007bff',
                  borderColor: isDarkMode ? '#e9ecef' : '#007bff',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = isDarkMode
                    ? 'linear-gradient(to right, #fbc2eb, #a6c1ee)'
                    : 'linear-gradient(to right, #6a11cb, #2575fc)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = isDarkMode ? 'transparent' : '#fff';
                  e.currentTarget.style.color = isDarkMode ? '#e9ecef' : '#007bff';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Explore All Blogs
              </Button>
            </Col>
            <Col md={4} className="d-none d-md-block text-center">
              <video
                src="https://cdn.pixabay.com/video/2023/01/31/148803-796360498_large.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                }}
                aria-label="Technology thumbnail video"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Explore Bar */}
      <section
        className="explore-bar py-4 shadow-sm"
        style={{
          backgroundColor: isDarkMode ? '#2c2c2c' : '#e9ecef',
          borderBottom: isDarkMode ? '1px solid #444' : '1px solid #dee2e6',
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
              <Form onSubmit={handleSearch}>
                <InputGroup
                  style={{
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    borderRadius: '25px',
                    overflow: 'hidden',
                  }}
                >
                  <Form.Control
                    type="text"
                    placeholder="Search for articles, tutorials, and more..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: 'none',
                      padding: '12px 20px',
                      fontSize: '1.1rem',
                      backgroundColor: isDarkMode ? '#3a3a3a' : '#fff',
                      color: isDarkMode ? '#e9ecef' : '#343a40',
                    }}
                  />
                  <Button
                    variant={isDarkMode ? 'outline-light' : 'outline-primary'}
                    type="submit"
                    style={{
                      border: 'none',
                      padding: '12px 20px',
                      background: isDarkMode
                        ? 'linear-gradient(to right, #fbc2eb, #a6c1ee)'
                        : 'linear-gradient(to right,rgb(245, 85, 239), #2575fc)',
                      color: '#fff',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      zIndex: 1,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = isDarkMode
                        ? 'linear-gradient(to right, #a6c1ee, #fbc2eb)'
                        : 'linear-gradient(to right, #2575fc, #6a11cb)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = isDarkMode
                        ? 'linear-gradient(to right, #fbc2eb, #a6c1ee)'
                        : 'linear-gradient(to right, #6a11cb, #2575fc)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <i style={{ marginRight: '5px' }} className="bi bi-search"></i> Search
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Recent Posts & News Section */}
      <section
        className="news-section py-5"
        style={{
          backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
          color: isDarkMode ? '#e9ecef' : '#343a40',
        }}
      >
        <Container>
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '3rem',
              color: isDarkMode ? '#e9ecef' : '#343a40',
            }}
          >
            Latest Updates
          </h2>
          {error && (
            <Alert
              variant="danger"
              style={{
                borderRadius: '10px',
                fontSize: '1rem',
                backgroundColor: isDarkMode ? '#441111' : '#f8d7da',
                color: isDarkMode ? '#f5c6cb' : '#721c24',
              }}
            >
              {error}
            </Alert>
          )}
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Row>
              <Col lg={3}>
                <Nav
                  variant="pills"
                  className="flex-column"
                  style={{
                    backgroundColor: isDarkMode ? '#2c2c2c' : '#f1f3f5',
                    padding: '15px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Nav.Item>
                    <Nav.Link
                      eventKey="recent"
                      style={{
                        marginBottom: '10px',
                        borderRadius: '8px',
                        fontWeight: 500,
                        padding: '12px 20px',
                        transition: 'all 0.3s ease',
                        backgroundColor: activeTab === 'recent' ? (isDarkMode ? '#495057' : '#007bff') : 'transparent',
                        color: activeTab === 'recent' ? '#fff' : isDarkMode ? '#e9ecef' : '#343a40',
                      }}
                    >
                      Recent Posts
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="news"
                      style={{
                        marginBottom: '10px',
                        borderRadius: '8px',
                        fontWeight: 500,
                        padding: '12px 20px',
                        transition: 'all 0.3s ease',
                        backgroundColor: activeTab === 'news' ? (isDarkMode ? '#495057' : '#007bff') : 'transparent',
                        color: activeTab === 'news' ? '#fff' : isDarkMode ? '#e9ecef' : '#343a40',
                      }}
                    >
                      Tech News
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="trending"
                      style={{
                        borderRadius: '8px',
                        fontWeight: 500,
                        padding: '12px 20px',
                        transition: 'all 0.3s ease',
                        backgroundColor: activeTab === 'trending' ? (isDarkMode ? '#495057' : '#007bff') : 'transparent',
                        color: activeTab === 'trending' ? '#fff' : isDarkMode ? '#e9ecef' : '#343a40',
                      }}
                    >
                      Trending Tech
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col lg={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="recent">
                    {blogs.length === 0 && (
                      <p
                        style={{
                          fontSize: '1.1rem',
                          color: isDarkMode ? '#adb5bd' : '#6c757d',
                        }}
                      >
                        No posts found.
                      </p>
                    )}
                    {blogs.map((blog) => (
                      <Card
                        key={blog.id}
                        className="mb-3 shadow-sm"
                        style={{
                          borderRadius: '15px',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          backgroundColor: isDarkMode ? '#2c2c2c' : '#fff',
                          border: isDarkMode ? '1px solid #444' : '1px solid #dee2e6',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = isDarkMode
                            ? '0 8px 20px rgba(0, 0, 0, 0.3)'
                            : '0 8px 20px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = isDarkMode
                            ? '0 2px 5px rgba(0, 0, 0, 0.2)'
                            : '0 2px 5px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        <Row className="g-0">
                          <Col md={4}>
                            <Card.Img
                              src={blog.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                              alt={blog.title}
                              style={{
                                height: '100%',
                                objectFit: 'cover',
                                borderTopLeftRadius: '15px',
                                borderBottomLeftRadius: '15px',
                              }}
                            />
                          </Col>
                          <Col md={8}>
                            <Card.Body style={{ padding: '20px' }}>
                              <Card.Title
                                style={{
                                  fontSize: '1.5rem',
                                  fontWeight: 600,
                                  color: isDarkMode ? '#e9ecef' : '#343a40',
                                }}
                              >
                                {blog.title}
                              </Card.Title>
                              <Card.Text
                                style={{
                                  fontSize: '1rem',
                                  color: isDarkMode ? '#adb5bd' : '#6c757d',
                                }}
                              >
                                {blog.excerpt}
                              </Card.Text>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <small
                                  style={{
                                    fontSize: '0.9rem',
                                    color: isDarkMode ? '#adb5bd' : '#6c757d',
                                  }}
                                >
                                  By {blog.author || 'Unknown'}
                                </small>
                                <Button
                                  variant={isDarkMode ? 'outline-light' : 'outline-primary'}
                                  size="sm"
                                  as={Link}
                                  to={`/blog/${blog.id}`}
                                  style={{
                                    borderRadius: '20px',
                                    padding: '8px 20px',
                                    fontWeight: 500,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    zIndex: 1,
                                    background: 'transparent',
                                    color: isDarkMode ? '#e9ecef' : '#007bff',
                                    borderColor: isDarkMode ? '#e9ecef' : '#007bff',
                                    transition: 'all 0.3s ease',
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.background = isDarkMode
                                      ? 'linear-gradient(to right, #fbc2eb, #a6c1ee)'
                                      : 'linear-gradient(to right, #6a11cb, #2575fc)';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = isDarkMode ? '#e9ecef' : '#007bff';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                  }}
                                >
                                  Read More
                                </Button>
                              </div>
                            </Card.Body>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    <div
                      style={{
                        textAlign: 'center',
                        marginTop: '2rem',
                      }}
                    >
                      <Button
                        as={Link}
                        to="/blogs"
                        variant="primary"
                        style={{
                          borderRadius: '25px',
                          padding: '10px 30px',
                          fontWeight: 500,
                          background: isDarkMode
                            ? 'linear-gradient(to right, #fbc2eb, #a6c1ee)'
                            : 'linear-gradient(to right,rgb(149, 82, 222), #2575fc)',
                          color: '#fff',
                          border: 'none',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                          zIndex: 1,
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = isDarkMode
                            ? 'linear-gradient(to right, #a6c1ee, #fbc2eb)'
                            : 'linear-gradient(to right, #2575fc, #6a11cb)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = isDarkMode
                            ? 'linear-gradient(to right, #fbc2eb, #a6c1ee)'
                            : 'linear-gradient(to right, #6a11cb, #2575fc)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        View All Blog Posts
                      </Button>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="news">
                    {recentTechNews.length === 0 && (
                      <p
                        style={{
                          fontSize: '1.1rem',
                          color: isDarkMode ? '#adb5bd' : '#6c757d',
                        }}
                      >
                        No news found.
                      </p>
                    )}
                    {recentTechNews.map((news) => (
                      <Card
                        key={news.id}
                        className="mb-3 shadow-sm"
                        style={{
                          borderRadius: '15px',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          backgroundColor: isDarkMode ? '#2c2c2c' : '#fff',
                          border: isDarkMode ? '1px solid #444' : '1px solid #dee2e6',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = isDarkMode
                            ? '0 8px 20px rgba(0, 0, 0, 0.3)'
                            : '0 8px 20px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = isDarkMode
                            ? '0 2px 5px rgba(0, 0, 0, 0.2)'
                            : '0 2px 5px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        <Card.Body style={{ padding: '20px' }}>
                          <Card.Title
                            style={{
                              fontSize: '1.5rem',
                              fontWeight: 600,
                              color: isDarkMode ? '#e9ecef' : '#343a40',
                            }}
                          >
                            {news.title}
                          </Card.Title>
                          <Card.Text
                            style={{
                              fontSize: '1rem',
                              color: isDarkMode ? '#adb5bd' : '#6c757d',
                            }}
                          >
                            {news.summary}
                          </Card.Text>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <small
                              style={{
                                fontSize: '0.9rem',
                                color: isDarkMode ? '#adb5bd' : '#6c757d',
                              }}
                            >
                              {news.url ? (
                                <a
                                  href={news.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: isDarkMode ? '#81b1ff' : '#007bff',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                  }}
                                  onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                  onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                                >
                                  {news.source}
                                </a>
                              ) : (
                                <span>{news.source}</span>
                              )}
                            </small>
                            <small
                              style={{
                                fontSize: '0.9rem',
                                color: isDarkMode ? '#adb5bd' : '#6c757d',
                              }}
                            >
                              {new Date(news.created_at).toLocaleDateString()}
                            </small>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </Tab.Pane>
                  <Tab.Pane eventKey="trending">
                    {trendingTech.length === 0 && (
                      <p
                        style={{
                          fontSize: '1.1rem',
                          color: isDarkMode ? '#adb5bd' : '#6c757d',
                        }}
                      >
                        No trending items found.
                      </p>
                    )}
                    {trendingTech.map((item) => (
                      <Card
                        key={item.id}
                        className="mb-3 shadow-sm"
                        style={{
                          borderRadius: '15px',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          backgroundColor: isDarkMode ? '#2c2c2c' : '#fff',
                          border: isDarkMode ? '1px solid #444' : '1px solid #dee2e6',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = isDarkMode
                            ? '0 8px 20px rgba(0, 0, 0, 0.3)'
                            : '0 8px 20px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = isDarkMode
                            ? '0 2px 5px rgba(0, 0, 0, 0.2)'
                            : '0 2px 5px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        <Card.Body style={{ padding: '20px' }}>
                          <Card.Title
                            style={{
                              fontSize: '1.5rem',
                              fontWeight: 600,
                              color: isDarkMode ? '#e9ecef' : '#343a40',
                            }}
                          >
                            {item.title}
                          </Card.Title>
                          <Card.Text
                            style={{
                              fontSize: '1rem',
                              color: isDarkMode ? '#adb5bd' : '#6c757d',
                            }}
                          >
                            {item.summary}
                          </Card.Text>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <small
                              style={{
                                fontSize: '0.9rem',
                                color: isDarkMode ? '#adb5bd' : '#6c757d',
                              }}
                            >
                              {item.source}
                            </small>
                            <small
                              style={{
                                fontSize: '0.9rem',
                                color: isDarkMode ? '#adb5bd' : '#6c757d',
                              }}
                            >
                              {new Date(item.created_at).toLocaleDateString()}
                            </small>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
      </section>

      {/* Footer Section */}
      <footer
        className="footer-section py-5"
        style={{
          backgroundColor: isDarkMode ? '#1a1a1a' : '#343a40',
          color: isDarkMode ? '#adb5bd' : '#ffffff',
          borderTop: isDarkMode ? '1px solid #444' : '1px solid #495057',
        }}
      >
        <Container>
          <Row>
            <Col md={4} className="mb-4">
              <h5
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: isDarkMode ? '#e9ecef' : '#ffffff',
                  marginBottom: '1.5rem',
                }}
              >
                About AK Blog
              </h5>
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  color: isDarkMode ? '#adb5bd' : '#d1d4d8',
                }}
              >
                AK Blog is your go-to source for the latest insights in technology, web development, and programming trends.
              </p>
            </Col>
            <Col md={4} className="mb-4">
              <h5
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: isDarkMode ? '#e9ecef' : '#ffffff',
                  marginBottom: '1.5rem',
                }}
              >
                Quick Links
              </h5>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                }}
              >
                <li>
                  <Link
                    to="/"
                    style={{
                      color: isDarkMode ? '#adb5bd' : '#d1d4d8',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = isDarkMode ? '#a6c1ee' : '#007bff')}
                    onMouseOut={(e) => (e.currentTarget.style.color = isDarkMode ? '#adb5bd' : '#d1d4d8')}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blogs"
                    style={{
                      color: isDarkMode ? '#adb5bd' : '#d1d4d8',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = isDarkMode ? '#a6c1ee' : '#007bff')}
                    onMouseOut={(e) => (e.currentTarget.style.color = isDarkMode ? '#adb5bd' : '#d1d4d8')}
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    style={{
                      color: isDarkMode ? '#adb5bd' : '#d1d4d8',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = isDarkMode ? '#a6c1ee' : '#007bff')}
                    onMouseOut={(e) => (e.currentTarget.style.color = isDarkMode ? '#adb5bd' : '#d1d4d8')}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    style={{
                      color: isDarkMode ? '#adb5bd' : '#d1d4d8',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = isDarkMode ? '#a6c1ee' : '#007bff')}
                    onMouseOut={(e) => (e.currentTarget.style.color = isDarkMode ? '#adb5bd' : '#d1d4d8')}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </Col>
            <Col md={4} className="mb-4">
              <h5
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: isDarkMode ? '#e9ecef' : '#ffffff',
                  marginBottom: '1.5rem',
                }}
              >
                Follow Us
              </h5>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                }}
              >
                <li style={{ marginBottom: '10px' }}>
                  <a
                    href="https://x.com/ABHISHEKAI0"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: isDarkMode ? '#adb5bd' : '#d1d4d8',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      transition: 'color 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = isDarkMode ? '#a6c1ee' : '#007bff')}
                    onMouseOut={(e) => (e.currentTarget.style.color = isDarkMode ? '#adb5bd' : '#d1d4d8')}
                  >
                    <i className="bi bi-twitter" style={{ marginRight: '8px', fontSize: '1.2rem' }}></i>
                    Twitter
                  </a>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <a
                    href="https://www.facebook.com/profile.php?id=61577578597805"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: isDarkMode ? '#adb5bd' : '#d1d4d8',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      transition: 'color 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = isDarkMode ? '#a6c1ee' : '#007bff')}
                    onMouseOut={(e) => (e.currentTarget.style.color = isDarkMode ? '#adb5bd' : '#d1d4d8')}
                  >
                    <i className="bi bi-facebook" style={{ marginRight: '8px', fontSize: '1.2rem' }}></i>
                    Facebook
                  </a>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: isDarkMode ? '#adb5bd' : '#d1d4d8',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      transition: 'color 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = isDarkMode ? '#a6c1ee' : '#007bff')}
                    onMouseOut={(e) => (e.currentTarget.style.color = isDarkMode ? '#adb5bd' : '#d1d4d8')}
                  >
                    <i className="bi bi-linkedin" style={{ marginRight: '8px', fontSize: '1.2rem' }}></i>
                    LinkedIn
                  </a>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <a
                    href="https://github.com/AK-WORLD01"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: isDarkMode ? '#adb5bd' : '#d1d4d8',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      transition: 'color 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = isDarkMode ? '#a6c1ee' : '#007bff')}
                    onMouseOut={(e) => (e.currentTarget.style.color = isDarkMode ? '#adb5bd' : '#d1d4d8')}
                  >
                    <i className="bi bi-github" style={{ marginRight: '8px', fontSize: '1.2rem' }}></i>
                    GitHub
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
          <hr
            style={{
              borderColor: isDarkMode ? '#444' : '#495057',
              margin: '2rem 0',
            }}
          />
          <Row>
            <Col className="text-center">
              <p
                style={{
                  fontSize: '0.9rem',
                  color: isDarkMode ? '#adb5bd' : '#d1d4d8',
                }}
              >
                © {new Date().getFullYear()} AK Blog. All rights reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;