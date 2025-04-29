import { sellCryptoCurrecy } from '@/redux/thunks';
import { resetSellState } from '@/redux/transactionsSlice'; // NEW
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

export default function SellCryptoModal({ show, onClose, cryptoCurrencyName, cryptoCurrencyPrice }) {

  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState('');
  const [totalAmount, setTotalAmount] = useState('0.00');
  const { error, data, isLoading } = useSelector(state => state.transactions.sell);

  const successMessage = data && Object.keys(data).length > 0;

  useEffect(() => {
    if (!quantity || isNaN(quantity)) {
      setTotalAmount('0.00');
      return;
    }
    setTotalAmount((cryptoCurrencyPrice * Number(quantity)).toFixed(2));
  }, [quantity, cryptoCurrencyPrice]);

  useEffect(() => {
    if (!show) {
      setQuantity('');
      dispatch(resetSellState()); // CLEAR success when modal closes
    }
  }, [show, dispatch]);

  const handleSellClick = () => {
    const sellRequest = {
      cryptoSymbol: cryptoCurrencyName,
      quantity: Number(quantity),
    };

    dispatch(sellCryptoCurrecy(sellRequest));
  };

  const handleOkClick = () => {
    setQuantity('');
    setTotalAmount('0.00');
    dispatch(resetSellState());
    onClose();
  };

  const isSellDisabled = !quantity || isNaN(quantity) || Number(quantity) <= 0;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Продай {cryptoCurrencyName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!successMessage ? (
          <>
            <Row className="mb-3">
              <Col>
                <div className="text-center">
                  <h5>Цена за един {cryptoCurrencyName}</h5>
                  <h4 className="text-success">${cryptoCurrencyPrice}</h4>
                </div>
              </Col>
            </Row>
            <Form>
              <Form.Group controlId="quantityInput">
                <Form.Label>Количество</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Въведете количество"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Form.Group>
            </Form>
            <div className="mt-4 text-center">
              <h5>Обща сума:</h5>
              <h4 className="text-primary">${totalAmount}</h4>
            </div>

            {error && (
              <div className="mt-3 text-danger text-center">
                {error === "NO_STOCK_AVAILABLE" && `Нямате наличности на ${cryptoCurrencyName}.`}
                {error === "NOT_ENOUGH_QUANTITY" && "Нямате достатъчно количество за продажба."}
              </div>
            )}
          </>
        ) : (
          <div className="mt-3 text-center">
            <h2>Успешно продадохте {quantity} {cryptoCurrencyName}!</h2>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="d-flex flex-column">
        {!successMessage ? (
          <Button
            variant="success"
            onClick={handleSellClick}
            disabled={isSellDisabled}
            className="w-100 mb-2"
          >
            Потвърди продажба
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={handleOkClick}
            className="w-100 mb-2"
          >
            OK
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
