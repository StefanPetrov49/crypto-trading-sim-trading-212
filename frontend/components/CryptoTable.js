import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import BuyCryptoModal from './BuyCryptoModal';
import SellCryptoModal from './SellCryptoModal';

const symbols = [
    'BTC/USD', 'ETH/USD', 'USDT/USD', 'XRP/USD', 'BNB/USD',
    'SOL/USD', 'USDC/USD', 'DOGE/USD', 'ADA/USD', 'TRX/USD',
    'WBTC/USD', 'SUI/USD', 'LINK/USD', 'AVAX/USD', 'XLM/USD',
    'SHIB/USD', 'TON/USD', 'BCH/USD', 'DOT/USD', 'LTC/USD'
];

export default function CryptoTable() {
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const livePrices = useSelector(state => state.cryptoPrices.prices);
    const previousPrices = useRef({});

    const [showBuyModal, setShowBuyModal] = useState(false);
    const [showSellModal, setShowSellModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const [selectedCryptoCurrency, setSelectedCryptoCurrency] = useState(null);
    const [selectedCryptoCurrencyPrice, setSelectedCryptoCurrencyPrice] = useState(null);

    useEffect(() => {
        if (selectedCryptoCurrency) {
            const updatedData = livePrices[`${selectedCryptoCurrency}/USD`];
            if (updatedData?.price) {
                setSelectedCryptoCurrencyPrice(updatedData.price);
            }
        }
    }, [livePrices, selectedCryptoCurrency]);

    const handleBuyClick = (symbol) => {
        if (!isLoggedIn) {
            setShowAuthModal(true);
            return;
        }
        const coinName = symbol.split('/')[0];
        const price = livePrices[symbol];

        setSelectedCryptoCurrency(coinName);
        setSelectedCryptoCurrencyPrice(price);
        setShowBuyModal(true);
    };

    const handleSellClick = (symbol) => {
        if (!isLoggedIn) {
            setShowAuthModal(true);
            return;
        }
        const coinName = symbol.split('/')[0];
        const price = livePrices[symbol];

        setSelectedCryptoCurrency(coinName);
        setSelectedCryptoCurrencyPrice(price);
        setShowSellModal(true);
    };

    const handleCloseModal = () => {
        setShowBuyModal(false);
        setShowSellModal(false);
    };

    const handleAuthModalClose = () => {
        setShowAuthModal(false);
    };

    return (
        <div className="container px-5 mt-5">
            <h2 className="mb-4 text-center">🚀 Топ 20 Криптовалути</h2>

            <Table bordered hover responsive className="text-center align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Име</th>
                        <th>Цена</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {symbols.map((symbol, index) => {
                        const rawPrice = livePrices[symbol];
                        const previousPrice = previousPrices.current[symbol];
                        const formattedPrice = rawPrice ? `$${rawPrice.toFixed(4)}` : 'Зареждане...';

                        let priceClass = '';
                        if (previousPrice !== undefined) {
                            if (rawPrice > previousPrice) {
                                priceClass = 'text-success';
                            } else if (rawPrice < previousPrice) {
                                priceClass = 'text-danger';
                            }
                        }

                        previousPrices.current[symbol] = rawPrice;

                        const coinName = symbol.split('/')[0];

                        return (
                            <tr key={symbol}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <img
                                            src={`/images/${coinName}.png`}
                                            alt={coinName}
                                            style={{ width: '32px', height: '32px', objectFit: 'contain', marginBottom: '6px' }}
                                        />
                                        <strong>{coinName}</strong>
                                        <div className="text-muted small">{symbol}</div>
                                    </div>
                                </td>
                                <td className={priceClass}>
                                    <strong>{formattedPrice}</strong>
                                </td>
                                <td>
                                    <div className="d-flex justify-content-center gap-2">
                                        <Button variant="success" onClick={() => handleBuyClick(symbol)}>
                                            Купи
                                        </Button>
                                        <Button variant="primary" onClick={() => handleSellClick(symbol)}>
                                            Продай
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            {/* Buy Modal */}
            {showBuyModal && (
                <BuyCryptoModal
                    show={showBuyModal}
                    onClose={handleCloseModal}
                    cryptoCurrencyName={selectedCryptoCurrency}
                    cryptoCurrencyPrice={selectedCryptoCurrencyPrice}
                />
            )}

            {/* Sell Modal */}
            {showSellModal && (
                <SellCryptoModal
                    show={showSellModal}
                    onClose={handleCloseModal}
                    cryptoCurrencyName={selectedCryptoCurrency}
                    cryptoCurrencyPrice={selectedCryptoCurrencyPrice}
                />
            )}

            {/* Auth Required Modal */}
            <Modal show={showAuthModal} onHide={handleAuthModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Добре дошли!</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p>За да купувате или продавате криптовалути, моля първо влезте или се регистрирайте.</p>
                    <div className="d-flex justify-content-center mt-4">
                        <Button href="/register" variant="success" size="lg" className="me-3">
                            Регистрация
                        </Button>
                        <Button href="/login" variant="light" size="lg">
                            Вход
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
