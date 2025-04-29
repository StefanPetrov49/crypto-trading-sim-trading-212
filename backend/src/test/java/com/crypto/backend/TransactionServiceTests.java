package com.crypto.backend;

import com.crypto.backend.crypto.models.CryptoSymbol;
import com.crypto.backend.customers.CustomerService;
import com.crypto.backend.customers.models.CreateCustomerRequest;
import com.crypto.backend.customers.models.CustomerResponse;
import com.crypto.backend.exceptions.models.InsufficientFundsException;
import com.crypto.backend.exceptions.models.NoStockAvailableException;
import com.crypto.backend.exceptions.models.NotEnoughQuantityException;
import com.crypto.backend.exceptions.models.UsernameTakenException;
import com.crypto.backend.transactions.TransactionService;
import com.crypto.backend.transactions.models.TransactionAction;
import com.crypto.backend.transactions.models.TransactionHistory;
import com.crypto.backend.transactions.models.TransactionRequest;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class TransactionServiceTests
{
    @Autowired
    private CustomerService customerService;

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    TransactionService transactionService;

    private long customerId;

    @BeforeEach
    void createCustomers()
    {
        CreateCustomerRequest request = new CreateCustomerRequest("Stefan", "Petrov", "Petrov4o", "test");
        CustomerResponse customer = customerService.createCustomer(request);
        this.customerId = customer.customerId();
    }

    @AfterEach
    void cleanUpResources()
    {
        namedParameterJdbcTemplate.getJdbcTemplate().execute("DELETE FROM transactions_history");
        namedParameterJdbcTemplate.getJdbcTemplate().execute("DELETE FROM customers");
    }

    @Test
    void buyCryptoCurrencyShouldSaveRecordInTransactionsHistoryAndReduceBalance()
    {
        TransactionRequest request = new TransactionRequest(CryptoSymbol.BTC, 0.05);

        CustomerResponse customer = transactionService.buy(customerId, request);

        List<TransactionHistory> transactionHistoryList = transactionService.getTransactionHistoryByCustomerId(customerId);

        assertTrue(
                customer.balance().compareTo(BigDecimal.valueOf(10000)) < 0,
                "Customer balance should be less than 10,000 after buying crypto");
        assertEquals(1, transactionHistoryList.size(), "There should be exactly one transaction record");

        TransactionHistory transaction = transactionHistoryList.get(0);
        assertEquals(CryptoSymbol.BTC, transaction.cryptoSymbol(), "Crypto symbol should be BTC");
        assertEquals(0.05, transaction.quantity(), 0.0001, "Quantity should be 0.05");
        assertEquals(TransactionAction.BUY, transaction.action(), "Transaction action should be BUY");
    }

    @Test
    void buyCryptoCurrencyShouldThrowInsufficientFundsException()
    {
        TransactionRequest request = new TransactionRequest(CryptoSymbol.BTC, 2.5);

        InsufficientFundsException exception = assertThrows(
                InsufficientFundsException.class,
                () -> transactionService.buy(customerId, request));

        assertEquals("INSUFFICIENT_FUNDS", exception.getMessage());
    }

    @Test
    void buyAndThenSellCryptoCurrencyShouldHaveTwoTransactionsHistoryRecords()
    {
        TransactionRequest request = new TransactionRequest(CryptoSymbol.BTC, 0.05);
        CustomerResponse customer = transactionService.buy(customerId, request);

        CustomerResponse customerResponse = transactionService.sell(customerId, request);

        List<TransactionHistory> transactionHistoryList = transactionService.getTransactionHistoryByCustomerId(customerId);
        assertEquals(2, transactionHistoryList.size(), "There should be exactly two transaction records");
        TransactionHistory transaction = transactionHistoryList.get(1);
        assertEquals(CryptoSymbol.BTC, transaction.cryptoSymbol(), "Crypto symbol should be BTC");
        assertEquals(0.05, transaction.quantity(), 0.0001, "Quantity should be 0.05");
        assertEquals(TransactionAction.SELL, transaction.action(), "Transaction action should be SELL");
    }

    @Test
    void sellCryptoCurrencyThatYouDoNotHaveShouldThrowNoStockAvailableException()
    {
        TransactionRequest request = new TransactionRequest(CryptoSymbol.BTC, 0.1337);

        NoStockAvailableException exception = assertThrows(
                NoStockAvailableException.class,
                () -> transactionService.sell(customerId, request));

        assertEquals("NO_STOCK_AVAILABLE", exception.getMessage());
    }

    @Test
    void sellCryptoCurrencyThatYouDoNotHaveEnoughQuantityShouldThrowNotEnoughQuantityException()
    {
        TransactionRequest request = new TransactionRequest(CryptoSymbol.BTC, 0.01337);
        CustomerResponse customer = transactionService.buy(customerId, request);
        TransactionRequest sellRequest = new TransactionRequest(CryptoSymbol.BTC, 0.5);

        NotEnoughQuantityException exception = assertThrows(
                NotEnoughQuantityException.class,
                () -> transactionService.sell(customerId, sellRequest));

        assertEquals("NOT_ENOUGH_QUANTITY", exception.getMessage());
    }

    @Test
    void resetCustomerShouldClearAllTransactionsHistoryAndReturnBalanceToStartingAmount()
    {
        TransactionRequest request = new TransactionRequest(CryptoSymbol.BTC, 0.01337);
        CustomerResponse customer = transactionService.buy(customerId, request);

        CustomerResponse customerResponse = transactionService.resetCustomer(customerId);

        List<TransactionHistory> transactionHistoryList = transactionService.getTransactionHistoryByCustomerId(customerId);
        assertEquals(0, transactionHistoryList.size(), "Transactions list should be empty");
        assertEquals(BigDecimal.valueOf(10000), customerResponse.balance(), "After reset customer balance should be 10000");
    }

}
