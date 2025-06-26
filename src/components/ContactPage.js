import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Contact.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess('');
    setError('');

    // Client-side validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    if (formData.message.length < 10) {
      setError('Message must be at least 10 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Submitting contact message:', formData);
      const response = await axios.post(`${API_URL}/api/contact`, {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Contact submission response:', response.data);
      setSuccess(response.data.message || 'Thank you for your message! We’ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Contact form submission error:', err);
      if (err.response) {
        setError(err.response.data.error || 'Failed to send message. Please try again later.');
      } else if (err.request) {
        setError('Unable to reach the server. Please check your connection or try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="contact-page my-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <h1 className="text-center mb-5">Contact Us</h1>
          {success && <Alert variant="success" role="alert">{success}</Alert>}
          {error && <Alert variant="danger" role="alert">{error}</Alert>}
          <Form noValidate className="needs-validation">
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                aria-required="true"
                aria-describedby="name-error"
                isInvalid={error.includes('name')}
              />
              {error.includes('name') && (
                <Form.Control.Feedback type="invalid" id="name-error">
                  {error}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                aria-required="true"
                aria-describedby="email-error"
                isInvalid={error.includes('email')}
              />
              {error.includes('email') && (
                <Form.Control.Feedback type="invalid" id="email-error">
                  {error}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Your message"
                required
                aria-required="true"
                aria-describedby="message-error"
                isInvalid={error.includes('message')}
              />
              {error.includes('message') && (
                <Form.Control.Feedback type="invalid" id="message-error">
                  {error}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <div className="text-center">
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isLoading}
                aria-label="Send message"
              >
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactPage;