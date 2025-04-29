package com.crypto.backend.transactions.models;

import com.crypto.backend.crypto.models.CryptoSymbol;

public record TransactionRequest(CryptoSymbol cryptoSymbol, Double quantity)
{
}
