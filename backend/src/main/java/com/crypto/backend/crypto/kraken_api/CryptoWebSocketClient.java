package com.crypto.backend.crypto.kraken_api;

import com.crypto.backend.crypto.models.CryptoSymbol;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class CryptoWebSocketClient {

    private WebSocketSession session;
    private final Map<String, BigDecimal> latestPrices = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String WS_URL = "wss://ws.kraken.com/v2";

    private static final List<String> SYMBOLS = List.of(
            "BTC/USD", "ETH/USD", "USDT/USD", "XRP/USD", "BNB/USD",
            "SOL/USD", "USDC/USD", "DOGE/USD", "ADA/USD", "TRX/USD",
            "WBTC/USD", "SUI/USD", "LINK/USD", "AVAX/USD", "XLM/USD",
            "SHIB/USD", "TON/USD", "BCH/USD", "DOT/USD", "LTC/USD"
    );

    @PostConstruct
    public void connect() {
        try {
            StandardWebSocketClient client = new StandardWebSocketClient();
            client.doHandshake(new CryptoWebSocketHandler(), WS_URL);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PreDestroy
    public void disconnect() {
        try {
            if (session != null && session.isOpen()) {
                session.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private class CryptoWebSocketHandler implements WebSocketHandler {

        @Override
        public void afterConnectionEstablished(WebSocketSession session) {
            CryptoWebSocketClient.this.session = session;
            System.out.println("WebSocket connection established.");

            subscribeToTicker();
        }

        private void subscribeToTicker() {
            try {
                String subscriptionMessage = objectMapper.writeValueAsString(Map.of(
                        "method", "subscribe",
                        "params", Map.of(
                                "channel", "ticker",
                                "symbol", SYMBOLS
                        )
                ));
                session.sendMessage(new TextMessage(subscriptionMessage));
//                System.out.println("Sent subscription: " + subscriptionMessage);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @Override
        public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) {
            try {
                JsonNode json = objectMapper.readTree(message.getPayload().toString());

                if (json.has("method") && "subscribe".equals(json.get("method").asText())) {
//                    System.out.println("Subscription confirmed: " + json);
                    return;
                }

                if (json.has("channel") && "ticker".equals(json.get("channel").asText())) {
                    JsonNode dataArray = json.get("data");

                    if (dataArray.isArray()) {
                        for (JsonNode tickerData : dataArray) {
                            String symbol = tickerData.get("symbol").asText(); // Example: DOT/USD
                            double lastPrice = tickerData.get("last").asDouble();

                            latestPrices.put(symbol, BigDecimal.valueOf(lastPrice));
//                            System.out.println(symbol + " => " + lastPrice);
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @Override
        public void handleTransportError(WebSocketSession session, Throwable exception) {
            exception.printStackTrace();
        }

        @Override
        public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) {
            System.out.println("WebSocket closed: " + closeStatus);
        }

        @Override
        public boolean supportsPartialMessages() {
            return false;
        }
    }

    public BigDecimal getLatestPrice(CryptoSymbol symbol) {
        String fullSymbol = symbol.name() + "/USD";
        return latestPrices.get(fullSymbol);
    }
}
