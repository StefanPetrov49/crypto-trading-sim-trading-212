package com.crypto.backend.transactions.repository;

import com.crypto.backend.crypto.models.CryptoSymbol;
import com.crypto.backend.transactions.models.TransactionAction;
import com.crypto.backend.transactions.models.TransactionHistory;
import org.springframework.jdbc.core.DataClassRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public class TransactionDAO
{
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public TransactionDAO(NamedParameterJdbcTemplate namedParameterJdbcTemplate)
    {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public void saveTransactionHistory(long customerId, CryptoSymbol cryptoSymbol, BigDecimal price, TransactionAction action, Double quantity)
    {
        final String sql = """
                INSERT INTO transactions_history
                (customer_id, crypto_symbol_id, bought_at_price, sold_at_price, quantity, action) VALUES
                (:customer_id, (SELECT cs.id FROM crypto_symbols cs WHERE cs.symbol = :crypto_symbol), :bought_at_price, :sold_at_price, :quantity, :action)
                """;

        final var params = new MapSqlParameterSource()
                .addValue("customer_id", customerId)
                .addValue("crypto_symbol", cryptoSymbol.name())
                .addValue("bought_at_price", action == TransactionAction.BUY ? price : null)
                .addValue("sold_at_price", action == TransactionAction.SELL ? price : null)
                .addValue("quantity", quantity)
                .addValue("action", action.name());

        namedParameterJdbcTemplate.update(sql, params);
    }

    public void deleteCustomerTransactions(long customerId)
    {
        final String sql = "DELETE FROM transactions_history WHERE customer_id = :customer_id";

        final var params = new MapSqlParameterSource()
                .addValue("customer_id", customerId);

        namedParameterJdbcTemplate.update(sql, params);
    }

    public List<TransactionHistory> getTransactionHistoryByCustomerId(long customerId)
    {
        final String sql = """
                SELECT th.id, customer_id, cs.symbol AS crypto_symbol, th.bought_at_price, th.sold_at_price, th.quantity, th.action, th.created_at
                FROM transactions_history th
                INNER JOIN crypto_symbols cs ON cs.id = th.crypto_symbol_id
                WHERE customer_id = :customer_id
                """;

        final var params = new MapSqlParameterSource()
                .addValue("customer_id", customerId);

        return namedParameterJdbcTemplate.query(sql, params, new DataClassRowMapper<>(TransactionHistory.class));
    }

    public List<TransactionHistory> getAllByCryptoSymbol(CryptoSymbol cryptoSymbol)
    {
        final String sql = """
                SELECT th.id, customer_id, cs.symbol AS crypto_symbol, th.bought_at_price, th.sold_at_price, th.quantity, th.action, th.created_at
                FROM transactions_history th
                INNER JOIN crypto_symbols cs ON cs.id = th.crypto_symbol_id
                WHERE cs.symbol = :crypto_symbol
                """;

        final var params = new MapSqlParameterSource()
                .addValue("crypto_symbol", cryptoSymbol.name());

        return namedParameterJdbcTemplate.query(sql, params, new DataClassRowMapper<>(TransactionHistory.class));
    }
}
