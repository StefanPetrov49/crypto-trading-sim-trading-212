package com.crypto.backend.transactions;

import com.crypto.backend.crypto.CryptoService;
import com.crypto.backend.customers.CustomerService;
import com.crypto.backend.customers.models.Customer;
import com.crypto.backend.customers.models.CustomerResponse;
import com.crypto.backend.exceptions.models.InsufficientFundsException;
import com.crypto.backend.exceptions.models.NoStockAvailableException;
import com.crypto.backend.exceptions.models.NotEnoughQuantityException;
import com.crypto.backend.transactions.models.TransactionHistory;
import com.crypto.backend.transactions.models.TransactionRequest;
import com.crypto.backend.crypto.models.CryptoSymbol;
import com.crypto.backend.transactions.models.TransactionAction;
import com.crypto.backend.transactions.repository.TransactionDAO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransactionService
{
    private CryptoService cryptoService;

    private CustomerService customerService;

    private TransactionDAO transactionDAO;

    public TransactionService(CryptoService cryptoService, CustomerService customerService, TransactionDAO transactionDAO)
    {
        this.cryptoService = cryptoService;
        this.customerService = customerService;
        this.transactionDAO = transactionDAO;
    }

    public CustomerResponse buy(long customerId, TransactionRequest transactionRequest)
    {
        Customer customer = customerService.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        BigDecimal price = cryptoService.getPriceBySymbol(transactionRequest.cryptoSymbol());
        hasEnoughMoney(customer.balance(), transactionRequest.quantity(), price);
        saveTransactionHistory(customer.id(), transactionRequest.cryptoSymbol(), price,
                TransactionAction.BUY, transactionRequest.quantity());

        BigDecimal newBalance = customerService.updateBalance(customer, transactionRequest.quantity(), price, TransactionAction.BUY);

        return new CustomerResponse(customerId, customer.firstName(), customer.lastName(), customer.username(), newBalance);
    }

    private void saveTransactionHistory(long customerId, CryptoSymbol cryptoSymbol, BigDecimal price, TransactionAction action, Double quantity)
    {
        transactionDAO.saveTransactionHistory(customerId, cryptoSymbol, price, action, quantity);
    }

    private void hasEnoughMoney(BigDecimal balance, Double quantity, BigDecimal price)
    {
        BigDecimal totalCost = price.multiply(BigDecimal.valueOf(quantity));

        if (balance.compareTo(totalCost) < 0)
        {
            throw new InsufficientFundsException("INSUFFICIENT_FUNDS");
        }
    }

    public CustomerResponse sell(long customerId, TransactionRequest transactionRequest)
    {
        Customer customer = customerService.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        hasStockAndQuantity(transactionRequest.cryptoSymbol(), transactionRequest.quantity());

        BigDecimal price = cryptoService.getPriceBySymbol(transactionRequest.cryptoSymbol());
        saveTransactionHistory(customer.id(), transactionRequest.cryptoSymbol(), price,
                TransactionAction.SELL, transactionRequest.quantity());

        BigDecimal newBalance = customerService.updateBalance(customer, transactionRequest.quantity(), price, TransactionAction.SELL);

        return new CustomerResponse(customerId, customer.firstName(), customer.lastName(), customer.username(), newBalance);
    }

    private void hasStockAndQuantity(CryptoSymbol cryptoSymbol, Double quantity) {
        List<TransactionHistory> transactionHistories = transactionDAO.getAllByCryptoSymbol(cryptoSymbol);

        if (transactionHistories.isEmpty()) {
            throw new NoStockAvailableException("NO_STOCK_AVAILABLE");
        }

        double totalAvailableQuantity = transactionHistories.stream()
                .mapToDouble(TransactionHistory::quantity)
                .sum();

        if (quantity > totalAvailableQuantity) {
            throw new NotEnoughQuantityException("NOT_ENOUGH_QUANTITY");
        }
    }

    private void deleteCustomerTransactions(long customerId)
    {
        transactionDAO.deleteCustomerTransactions(customerId);
    }

    public CustomerResponse resetCustomer(long customerId)
    {
        Customer customer = customerService.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        deleteCustomerTransactions(customerId);
        customerService.resetCustomerBalance(customerId);

        return new CustomerResponse(customerId, customer.firstName(), customer.lastName(), customer.username(), BigDecimal.valueOf(10000));
    }

    public List<TransactionHistory> getTransactionHistoryByCustomerId(long customerId)
    {
        return transactionDAO.getTransactionHistoryByCustomerId(customerId);
    }
}
