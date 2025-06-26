import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BlogPost.css';

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError('Unable to load post. Please try again later.');
        console.error('Fetch post error:', err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading post...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" role="alert">{error}</Alert>
        <div className="text-center">
          <Button as={Link} to="/blogs" variant="primary" aria-label="Back to all blogs">
            Back to Blogs
          </Button>
        </div>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="my-5">
        <Alert variant="warning" role="alert">Post not found.</Alert>
        <div className="text-center">
          <Button as={Link} to="/blogs" variant="primary" aria-label="Back to all blogs">
            Back to Blogs
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="blog-post-page my-5" role="main" aria-labelledby="post-title">
      <Container>
        <Row>
          <Col lg={10} className="mx-auto">
            <Card className="shadow-sm">
              {post.image && (
                <Card.Img
                  variant="top"
                  src={post.image}
                  alt={post.title}
                  className="post-image"
                  style={{ objectFit: 'cover', maxHeight: '400px' }}
                />
              )}
              <Card.Body>
                <Card.Title as="h1" id="post-title">{post.title}</Card.Title>
                <Card.Subtitle className="mb-3 text-muted">
                  By {post.author || 'Unknown'} | {new Date(post.created_at).toLocaleDateString()}
                </Card.Subtitle>
                <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                <div className="text-center mt-4">
                  <Button as={Link} to="/blogs" variant="outline-primary" aria-label="Back to all blogs">
                    Back to Blogs
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BlogPostPage;