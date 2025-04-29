package com.crypto.backend.transactions.models;

import com.crypto.backend.crypto.models.CryptoSymbol;

import java.math.BigDecimal;
import java.util.Date;

public record TransactionHistory(long id, long customerId, CryptoSymbol cryptoSymbol, BigDecimal boughtAtPrice, BigDecimal soldAtPrice,
                                 Double quantity, TransactionAction action, Date createdAt)
{}
