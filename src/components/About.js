import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './About.css';
import techInnovation from './assests/Untitled-video-Made-with-Clipc-unscreen.gif';

const About = () => {
  const isDarkMode = document.body.classList.contains('dark-mode');

  return (
    <div
      className="about-page"
      style={{
        backgroundColor: isDarkMode ? '#121212' : '#f8f9fa',
        color: isDarkMode ? '#e9ecef' : '#343a40',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Hero Section */}
      <section
        className="hero-section py-5 text-white text-center"
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, #a50e7a, #110e78)'
            : 'linear-gradient(135deg, #007bff, #6610f2)',
        }}
      >
        <Container>
          <h1 className="display-4">About AK Blog</h1>
          <p className="lead">
            Your go-to platform for the latest insights in technology, web development, and programming trends.
          </p>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="mission-section py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h2>Our Mission</h2>
              <p>
                At AK Blog, we aim to empower developers, tech enthusiasts, and curious minds by providing high-quality, up-to-date content on the ever-evolving world of technology. From in-depth tutorials to breaking tech news, we’re here to fuel your passion for innovation.
              </p>
              <p>
                Our platform is built for the community, by the community. Whether you’re a seasoned developer or just starting out, AK Blog is your space to learn, share, and grow.
              </p>
            </Col>
            <Col md={6}>
              <img
                src={techInnovation}
                alt="Tech Innovation"
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Highlights Section */}
      <section
        className="highlights-section py-5"
        style={{
          backgroundColor: isDarkMode ? '#1e1e1e' : '#f8f9fa',
        }}
      >
        <Container>
          <h2 className="text-center mb-5">Why Choose AK Blog?</h2>
          <Row>
            <Col md={4}>
              <Card
                className="mb-4 shadow-sm h-100"
                style={{
                  backgroundColor: isDarkMode ? '#2c2c2c' : '#fff',
                  border: isDarkMode ? '1px solid #444' : '1px solid #dee2e6',
                }}
              >
                <Card.Body className="text-center">
                  <div className="icon mb-3">
                    <i
                      className="bi bi-code-slash fs-2"
                      style={{ color: isDarkMode ? '#a6c1ee' : '#007bff' }}
                    ></i>
                  </div>
                  <Card.Title style={{ color: isDarkMode ? '#e9ecef' : '#343a40' }}>
                    Expert Content
                  </Card.Title>
                  <Card.Text style={{ color: isDarkMode ? '#adb5bd' : '#6c757d' }}>
                    Access tutorials, articles, and news crafted by industry experts and passionate contributors.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="mb-4 shadow-sm h-100"
                style={{
                  backgroundColor: isDarkMode ? '#2c2c2c' : '#fff',
                  border: isDarkMode ? '1px solid #444' : '1px solid #dee2e6',
                }}
              >
                <Card.Body className="text-center">
                  <div className="icon mb-3">
                    <i
                      className="bi bi-people fs-2"
                      style={{ color: isDarkMode ? '#a6c1ee' : '#007bff' }}
                    ></i>
                  </div>
                  <Card.Title style={{ color: isDarkMode ? '#e9ecef' : '#343a40' }}>
                    Community-Driven
                  </Card.Title>
                  <Card.Text style={{ color: isDarkMode ? '#adb5bd' : '#6c757d' }}>
                    Join a vibrant community where you can share your own tech insights and learn from others.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="mb-4 shadow-sm h-100"
                style={{
                  backgroundColor: isDarkMode ? '#2c2c2c' : '#fff',
                  border: isDarkMode ? '1px solid #444' : '1px solid #dee2e6',
                }}
              >
                <Card.Body className="text-center">
                  <div className="icon mb-3">
                    <i
                      className="bi bi-newspaper fs-2"
                      style={{ color: isDarkMode ? '#a6c1ee' : '#007bff' }}
                    ></i>
                  </div>
                  <Card.Title style={{ color: isDarkMode ? '#e9ecef' : '#343a40' }}>
                    Stay Updated
                  </Card.Title>
                  <Card.Text style={{ color: isDarkMode ? '#adb5bd' : '#6c757d' }}>
                    Get the latest tech news and trending topics delivered straight to your feed.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section
        className="cta-section py-5 text-center"
        style={{
          backgroundColor: isDarkMode ? '#2c2c2c' : '#fff',
        }}
      >
        <Container>
          <h2 style={{ color: isDarkMode ? '#e9ecef' : '#343a40' }}>
            Join the AK Blog Community
          </h2>
          <p
            className="lead"
            style={{ color: isDarkMode ? '#adb5bd' : '#6c757d' }}
          >
            Ready to dive into the world of tech? Explore our content or sign up to contribute your own!
          </p>
          <Button
            as={Link}
            to="/blogs"
            variant="primary"
            size="lg"
            className="mx-2"
            style={{
              background: isDarkMode
                ? 'linear-gradient(to right, #fbc2eb, #a6c1ee)'
                : 'linear-gradient(to right, #6a11cb, #2575fc)',
              border: 'none',
              color: '#fff',
              transition: 'all 0.3s ease',
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
            Explore Blogs
          </Button>
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
                    href="https://twitter.com"
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
                    href="https://facebook.com"
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
                    href="https://github.com"
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

export default About;