import Layout from '@/components/layout/Layout';
import { createUser } from '@/redux/thunks';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

export default function RegistrationForm() {

  const router = useRouter();
  const dispatch = useDispatch();
  const { error, data, isLoading } = useSelector(state => state.user.createUser);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createUser(formData));
    router.push('/login');
  };


  return (
    <Layout>
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <h2 className="mb-4 text-center">Регистрация</h2>
            <Form onSubmit={handleSubmit} className="p-4 border rounded bg-light">

              {error === "USERNAME_TAKEN" && (
                <Alert variant="danger" className="text-center">
                  Това потребителско име вече е заето.
                </Alert>
              )}

              <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>Име</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="Въведете име"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>Фамилия</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  placeholder="Въведете фамилия"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

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

              <div className="d-grid">
                <Button type="submit" variant="success" size="lg" disabled={isLoading}>
                  {isLoading ? "Регистриране..." : "Регистрирай се"}
                </Button>
              </div>

            </Form>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
