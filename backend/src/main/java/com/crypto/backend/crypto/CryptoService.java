package com.crypto.backend.crypto;

import com.crypto.backend.crypto.kraken_api.CryptoWebSocketClient;
import com.crypto.backend.crypto.repository.CryptoDAO;
import com.crypto.backend.crypto.models.CryptoSymbol;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class CryptoService
{
    private CryptoDAO cryptoDAO;

    private CryptoWebSocketClient cryptoWebSocketClient;

    public CryptoService(CryptoDAO cryptoDAO, CryptoWebSocketClient cryptoWebSocketClient)
    {
        this.cryptoDAO = cryptoDAO;
        this.cryptoWebSocketClient = cryptoWebSocketClient;
    }


    public BigDecimal getPriceBySymbol(CryptoSymbol symbol)
    {
        return cryptoWebSocketClient.getLatestPrice(symbol);
    }
}
