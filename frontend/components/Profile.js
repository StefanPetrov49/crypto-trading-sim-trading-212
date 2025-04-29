import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import ProfilePortfolioHistory from './ProfilePortfolioHistory';
import { resetCustomerBalance } from '@/redux/thunks';
import { useRouter } from 'next/router';

export default function Profile() {

  const router = useRouter();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleRestartClick = () => {
    dispatch(resetCustomerBalance());
    setShowConfirmModal(false);
    router.push("/");
  };

  useEffect(() => {
    const lsUser = localStorage.getItem("userData");
    if (lsUser) {
      setUserData(JSON.parse(lsUser));
    }
  }, []);

  return (
    <Container className="my-5">
      <ProfilePortfolioHistory userData={userData}/>

      {/* Big Red Restart Button */}
      <Row className="justify-content-center mb-5">
        <Col md={6} className="d-flex justify-content-center">
          <Button
            variant="danger"
            size="lg"
            className="w-100"
            onClick={() => setShowConfirmModal(true)}
          >
            Рестартирай Профила
          </Button>
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Рестартирай Профила си</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className="fw-bold">Сигурен ли си че искаш да рестартираш профила си?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Отказ
          </Button>
          <Button variant="danger" onClick={handleRestartClick}>
            Потвърди
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
