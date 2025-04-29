import { getTransactionsHistory } from '@/redux/thunks';
import React, { useEffect, useMemo } from 'react';
import { Container, Table, Badge, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

export default function ProfilePortfolioHistory({ userData }) {
    const dispatch = useDispatch();

    const livePrices = useSelector(state => state.cryptoPrices.prices);
    const transactions = useSelector(state => state.transactions.transactionsHistory.data);
    const balance = useSelector(state => state.transactions.balance);

    useEffect(() => {
        dispatch(getTransactionsHistory());
    }, [dispatch]);

    const { processedTransactions, activeHoldings, totalInvestment, netWorth, profit } = useMemo(() => {
        const safeTransactions = Array.isArray(transactions) ? transactions : [];

        const positions = {};
        const processedTransactions = [];

        safeTransactions.forEach(tx => {
            const symbol = tx.cryptoSymbol;
            if (!positions[symbol]) positions[symbol] = [];

            if (tx.action === "BUY") {
                positions[symbol].push({ quantity: tx.quantity, boughtAtPrice: tx.boughtAtPrice });
                processedTransactions.push({
                    ...tx,
                    status: 'HOLD',
                    realizedProfit: null
                });
            } else if (tx.action === "SELL") {
                let qtyToSell = tx.quantity;
                let realizedProfit = 0;

                while (qtyToSell > 0 && positions[symbol] && positions[symbol].length > 0) {
                    const lot = positions[symbol][0];
                    const sellQty = Math.min(qtyToSell, lot.quantity);

                    realizedProfit += sellQty * (tx.soldAtPrice - lot.boughtAtPrice);
                    lot.quantity -= sellQty;
                    qtyToSell -= sellQty;

                    if (lot.quantity === 0) {
                        positions[symbol].shift();
                    }
                }

                processedTransactions.push({
                    ...tx,
                    status: 'SOLD',
                    realizedProfit: realizedProfit
                });
            }
        });

        const activeHoldings = [];
        for (const symbol in positions) {
            positions[symbol].forEach(lot => {
                if (lot.quantity > 0) {
                    const livePrice = livePrices ? livePrices[`${symbol}/USD`] : 0;
                    const currentValue = lot.quantity * livePrice;
                    const invested = lot.boughtAtPrice * lot.quantity;
                    const totalProfit = currentValue - invested;

                    activeHoldings.push({
                        cryptoSymbol: symbol,
                        quantity: lot.quantity,
                        boughtAtPrice: lot.boughtAtPrice,
                        livePrice,
                        totalProfit
                    });
                }
            });
        }

        const totalInvestment = activeHoldings.reduce((acc, item) => acc + (item.boughtAtPrice * item.quantity), 0);
        const netWorth = activeHoldings.reduce((acc, item) => acc + (item.livePrice * item.quantity), 0);
        const profit = netWorth - totalInvestment;

        return { processedTransactions, activeHoldings, totalInvestment, netWorth, profit };
    }, [transactions, livePrices]);

    if (!Array.isArray(transactions)) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" variant="primary" />
                <div className="mt-3">Loading transaction history...</div>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <Row className="justify-content-center g-4 mb-5">
                {[
                    { title: 'Баланс', value: balance },
                    { title: 'Инвестирани пари', value: totalInvestment },
                    { title: 'Печалба', value: profit }
                ].map((item, idx) => (
                    <Col md={4} key={idx}>
                        <Card className="text-center border-dark shadow-sm profile-card-hover">
                            <Card.Body>
                                <Card.Title className="text-muted small">{item.title}</Card.Title>
                                <h3 className={item.value >= 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                                    {item.value.toFixed(2)}$
                                </h3>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <h2 className="mb-4 text-center">📜 История на Трансакциите</h2>

            <Table bordered hover responsive className="text-center align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Символ</th>
                        <th>Действие</th>
                        <th>Цена (1 бр.)</th>
                        <th>Количество</th>
                        <th>Дата</th>
                        <th>Резултат</th>
                    </tr>
                </thead>
                <tbody>
                    {processedTransactions.map((tx, idx) => {
                        const unitPrice = tx.boughtAtPrice !== null ? tx.boughtAtPrice : tx.soldAtPrice;
                        const formattedDate = tx.createdAt
                            ? new Date(tx.createdAt).toLocaleString('bg-BG').replace(',', '')
                            : '-';

                        return (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td className="d-flex align-items-center justify-content-center gap-2">
                                    <img
                                        src={`/images/${tx.cryptoSymbol}.png`}
                                        alt={tx.cryptoSymbol}
                                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                                    />
                                    <strong>{tx.cryptoSymbol}</strong>
                                </td>
                                <td>
                                    <Badge bg={tx.action === 'BUY' ? 'success' : 'danger'}>
                                        {tx.action}
                                    </Badge>
                                </td>
                                <td>${unitPrice.toFixed(4)}</td>
                                <td>{tx.quantity}</td>
                                <td>{formattedDate}</td>
                                <td>
                                    {tx.status === 'SOLD' ? (
                                        <span className={tx.realizedProfit >= 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                            {tx.realizedProfit.toFixed(4)}$
                                        </span>
                                    ) : (
                                        <Badge bg="info">Still Holding</Badge>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            <h2 className="my-4 text-center">💰 Активни Криптовалути</h2>

            <Table bordered hover responsive className="text-center align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Символ</th>
                        <th>Налично Количество</th>
                        <th>Купена Цена</th>
                        <th>Текуща Цена</th>
                        <th>Нереализирана Печалба/Загуба</th>
                    </tr>
                </thead>
                <tbody>
                    {activeHoldings.map((item, idx) => (
                        <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td className="d-flex align-items-center justify-content-center gap-2">
                                <img
                                    src={`/images/${item.cryptoSymbol}.png`}
                                    alt={item.cryptoSymbol}
                                    style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                                />
                                <strong>{item.cryptoSymbol}</strong>
                            </td>
                            <td>{item.quantity.toFixed(4)}</td>
                            <td>${item.boughtAtPrice.toFixed(4)}</td>
                            <td>${item.livePrice?.toFixed(4)}</td>
                            <td>
                                <span className={item.totalProfit >= 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                    {item.totalProfit.toFixed(4)}$
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}
