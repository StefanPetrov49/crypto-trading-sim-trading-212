package com.crypto.backend.customers;

import com.crypto.backend.customers.models.CreateCustomerRequest;
import com.crypto.backend.customers.models.Customer;
import com.crypto.backend.customers.models.CustomerResponse;
import com.crypto.backend.customers.repository.CustomerDAO;
import com.crypto.backend.exceptions.models.UsernameTakenException;
import com.crypto.backend.transactions.models.TransactionAction;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class CustomerService
{
    private CustomerDAO customerDAO;

    private BCryptPasswordEncoder bCryptPasswordEncoder;


    public CustomerService(CustomerDAO customerDAO, BCryptPasswordEncoder bCryptPasswordEncoder)
    {
        this.customerDAO = customerDAO;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public CustomerResponse createCustomer(CreateCustomerRequest createCustomerRequest)
    {
        isUsernameFree(createCustomerRequest.username());

        long customerId = customerDAO.save(createCustomerRequest.firstName(),
                createCustomerRequest.lastName(),
                createCustomerRequest.username(),
                bCryptPasswordEncoder.encode(createCustomerRequest.password()));

        return new CustomerResponse(customerId, createCustomerRequest.username(), createCustomerRequest.lastName(),
                createCustomerRequest.username(), BigDecimal.valueOf(10000));
    }

    private void isUsernameFree(String username)
    {
        Optional<Customer> customer = customerDAO.findByUsername(username);
        if (customer.isPresent())
        {
            throw new UsernameTakenException("USERNAME_TAKEN");
        }
    }

    public Optional<Customer> findById(long customerId)
    {
        return customerDAO.findById(customerId);
    }

    public BigDecimal updateBalance(Customer customer, Double quantity, BigDecimal price, TransactionAction action)
    {
        BigDecimal totalAmount = price.multiply(BigDecimal.valueOf(quantity));
        BigDecimal newBalance = action.equals(TransactionAction.BUY)
                ? customer.balance().subtract(totalAmount)
                : customer.balance().add(totalAmount);

        customerDAO.updateBalance(customer.id(), newBalance);

        return newBalance;
    }

    public void resetCustomerBalance(long customerId)
    {
        customerDAO.updateBalance(customerId, BigDecimal.valueOf(10000));
    }

    public CustomerResponse getCustomerById(long customerId)
    {
        Customer customer = customerDAO.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return new CustomerResponse(customerId, customer.firstName(),
                customer.lastName(), customer.username(), customer.balance());
    }
}
