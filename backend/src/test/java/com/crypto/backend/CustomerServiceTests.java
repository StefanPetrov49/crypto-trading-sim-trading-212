package com.crypto.backend;

import com.crypto.backend.customers.CustomerService;
import com.crypto.backend.customers.models.CreateCustomerRequest;
import com.crypto.backend.customers.models.CustomerResponse;
import com.crypto.backend.exceptions.models.UsernameTakenException;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class CustomerServiceTests
{
    @Autowired
    private CustomerService customerService;

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    private long customerId;

    @BeforeAll
    void createCustomers()
    {
        CreateCustomerRequest request = new CreateCustomerRequest("Stefan", "Petrov", "Petrov4o", "test");
        CustomerResponse customer  = customerService.createCustomer(request);
        this.customerId = customer.customerId();
    }

    @AfterAll
    void cleanUpResources()
    {
        namedParameterJdbcTemplate.getJdbcTemplate().execute("DELETE FROM transactions_history");
        namedParameterJdbcTemplate.getJdbcTemplate().execute("DELETE FROM customers");
    }

    @Test
    void testCreateCustomerShouldCreateCustomer()
    {
        CustomerResponse customerResponse = customerService.getCustomerById(customerId);

        assertEquals("Stefan", customerResponse.firstName(), "First name should be Stefan");
        assertEquals("Petrov", customerResponse.lastName(), "Last name should be Petrov");
        assertEquals("Petrov4o", customerResponse.username(), "Username should be petrov4o");
    }

    @Test
    void testCreateCustomerWithSameNameShouldThrowUsernameTakenError()
    {
        CreateCustomerRequest request = new CreateCustomerRequest("Stefan", "Petrov", "Petrov4o", "test");

        UsernameTakenException exception = assertThrows(
                UsernameTakenException.class,
                () -> customerService.createCustomer(request)
        );

        assertEquals("USERNAME_TAKEN", exception.getMessage());
    }

}
