import { buyCryptoCurrency } from '@/redux/thunks';
import { resetBuyState } from '@/redux/transactionsSlice';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

export default function BuyCryptoModal({ show, onClose, cryptoCurrencyName, cryptoCurrencyPrice }) {

  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState('');
  const [totalPrice, setTotalPrice] = useState('0.00');
  const { error, data, isLoading } = useSelector(state => state.transactions.buy);
  const successMessage = data && Object.keys(data).length > 0;

  useEffect(() => {
    if (!quantity || isNaN(quantity)) {
      setTotalPrice('0.00');
      return;
    }
    setTotalPrice((cryptoCurrencyPrice * Number(quantity)).toFixed(2));
  }, [quantity, cryptoCurrencyPrice]);

  const handleBuyClick = () => {
    const buyRequest = {
      cryptoSymbol: cryptoCurrencyName,
      quantity: Number(quantity),
    };

    dispatch(buyCryptoCurrency(buyRequest));
  };

  const isBuyDisabled = !quantity || isNaN(quantity) || Number(quantity) <= 0;

  const handleOkClick = () => {
    setQuantity('');
    setTotalPrice('0.00');
    dispatch(resetBuyState());
    onClose();
  };
  

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Купи {cryptoCurrencyName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        {!successMessage && (
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
              <h4 className="text-primary">${totalPrice}</h4>
            </div>
          </>
        )}

        {error && (
          <div className="mt-3 text-danger text-center">
            {error === "INSUFFICIENT_FUNDS" ? "Недостатъчен баланс за тази покупка." : error}
          </div>
        )}

        {successMessage && (
          <div className="mt-3 text-success text-center">
            <h2>Успешно закупихте {quantity} {cryptoCurrencyName}! </h2>
          </div>
        )}

      </Modal.Body>

      <Modal.Footer className="d-flex flex-column">
        {!successMessage ? (
          <Button
            variant="success"
            onClick={handleBuyClick}
            disabled={isBuyDisabled}
            className="w-100 mb-2"
          >
            Потвърди
          </Button>
        ) : (
          <Button
            variant="primary"
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
