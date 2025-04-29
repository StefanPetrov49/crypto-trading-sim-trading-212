import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/thunks';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData))
    router.push('/');
  };

  const handleRedirect = () => {
    router.push('/register');
  };

  return (
    <Layout>
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <h2 className="mb-4 text-center">Вход</h2>
            <Form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Потребителско име</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Въведете потребителско име"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Парола</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Въведете парола"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <div className="d-grid mb-3">
                <Button type="submit" variant="success" size="lg">
                  Вход
                </Button>
              </div>

              <div className="text-center">
                <Button variant="link" onClick={handleRedirect}>
                  Нямаш акаунт? Регистрирай се
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
