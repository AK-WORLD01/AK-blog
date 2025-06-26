import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Alert, Pagination, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AllBlogsPage.css';

const AllBlogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('newest');
  const postsPerPage = 6;

  const fetchBlogs = async (query = '', retryCount = 2) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts?search=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      if (retryCount > 0) {
        console.warn(`Retrying fetch... Attempts left: ${retryCount}`);
        setTimeout(() => fetchBlogs(query, retryCount - 1), 2000);
      } else {
        setError('Unable to load blog posts. Please try again later.');
        console.error('Fetch error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs(searchQuery);
  };

  // Sort blogs based on selected option
  const sortBlogs = (blogs) => {
    return [...blogs].sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortOption === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortOption === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });
  };

  // Client-side filtering and pagination
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBlogs = sortBlogs(filteredBlogs);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedBlogs.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="blogs-page">
      {/* Page Header */}
      <section className="page-header py-5 bg-primary text-white">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h1 className="display-4">All Blog Posts</h1>
              <p className="lead">Browse our complete collection of tech articles and tutorials</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Search and Sort Bar */}
      <section className="search-bar py-4 bg-light">
        <Container>
          <Row className="justify-content-between align-items-center">
            <Col md={8}>
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button variant="primary" type="submit">
                    <i className="bi bi-search"></i> Search
                  </Button>
                </InputGroup>
              </Form>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-sort">
                  Sort by: {sortOption === 'newest' ? 'Newest' : sortOption === 'oldest' ? 'Oldest' : 'Category'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSortOption('newest')}>Newest</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortOption('oldest')}>Oldest</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortOption('category')}>Category</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Blog Posts */}
      <section className="blog-posts py-5">
        <Container>
          {error && <Alert variant="danger">{error}</Alert>}
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading blog posts...</p>
            </div>
          ) : (
            <>
              <Row>
                {currentPosts.length > 0 ? (
                  currentPosts.map(blog => (
                    <Col key={blog.id} md={6} lg={4} className="mb-4">
                      <Card className="h-100 shadow-sm blog-card">
                        <Card.Img
                          variant="top"
                          src={blog.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                          alt={blog.title}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <Card.Body>
                          <span className="badge bg-primary mb-2">{blog.category}</span>
                          <Card.Title>{blog.title}</Card.Title>
                          <Card.Text>{blog.excerpt}</Card.Text>
                        </Card.Body>
                        <Card.Footer className="bg-transparent border-top-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              Posted on {new Date(blog.created_at).toLocaleDateString()}
                            </small>
                            <Button variant="outline-primary" size="sm" as={Link} to={`/blog/${blog.id}`}>
                              Read More
                            </Button>
                          </div>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col className="text-center py-5">
                    <h4>No blog posts found matching your search.</h4>
                  </Col>
                )}
              </Row>
              {totalPages > 1 && (
                <Pagination className="justify-content-center mt-4">
                  <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                  <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                  <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
              )}
            </>
          )}
        </Container>
      </section>
    </div>
  );
};

export default AllBlogsPage;