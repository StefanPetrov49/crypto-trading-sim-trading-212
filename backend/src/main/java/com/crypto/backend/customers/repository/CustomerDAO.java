package com.crypto.backend.customers.repository;

import com.crypto.backend.customers.models.Customer;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.DataClassRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.Optional;

@Repository
public class CustomerDAO
{
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public CustomerDAO(NamedParameterJdbcTemplate namedParameterJdbcTemplate)
    {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public long save(String firstName, String lastName, String username, String password)
    {
        final String sql = """
                INSERT INTO customers
                (first_name, last_name, username, password) VALUES
                (:first_name, :last_name, :username, :password)""";

        final var params = new MapSqlParameterSource()
                .addValue("first_name", firstName)
                .addValue("last_name", lastName)
                .addValue("username", username)
                .addValue("password", password);

        final KeyHolder keyHolder = new GeneratedKeyHolder();

        namedParameterJdbcTemplate.update(sql, params, keyHolder);

        return Objects.requireNonNull(keyHolder.getKey()).longValue();
    }

    public Optional<Customer> findByUsername(String username)
    {
        final String sql = "SELECT * FROM customers WHERE username = :username";

        final var params = new MapSqlParameterSource()
                .addValue("username", username);

        try
        {
            return Optional.ofNullable(namedParameterJdbcTemplate.queryForObject(sql, params, new DataClassRowMapper<>(Customer.class)));
        } catch (EmptyResultDataAccessException e)
        {
            return Optional.empty();
        }
    }

    public Optional<Customer> findById(long customerId)
    {
        final String sql = "SELECT * FROM customers WHERE id = :customer_id";

        final var params = new MapSqlParameterSource()
                .addValue("customer_id", customerId);

        try
        {
            return Optional.ofNullable(namedParameterJdbcTemplate.queryForObject(sql, params, new DataClassRowMapper<>(Customer.class)));
        } catch (EmptyResultDataAccessException e)
        {
            return Optional.empty();
        }
    }

    public void updateBalance(long customerId, BigDecimal balance)
    {
        final String sql = "UPDATE customers SET balance = :balance WHERE id = :customer_id";

        final var params = new MapSqlParameterSource()
                .addValue("balance", balance)
                .addValue("customer_id", customerId);

        namedParameterJdbcTemplate.update(sql, params);
    }
}
