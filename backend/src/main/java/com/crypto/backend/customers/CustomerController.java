package com.crypto.backend.customers;

import com.crypto.backend.customers.models.CreateCustomerRequest;
import com.crypto.backend.customers.models.CustomerResponse;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;


@RestController
@RequestMapping("/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    /**
     * Create a new customer account.
     *
     * @param createCustomerRequest the customer information including first name, last name, username, and password
     * @return a response containing the created customer's information including customer ID and initial balance
     *
     * Example request body:
     * {
     *   "firstName": "John",
     *   "lastName": "Doe",
     *   "username": "johndoe123",
     *   "password": "securePass"
     * }
     */
    @PostMapping
    public CustomerResponse createCustomer(@RequestBody CreateCustomerRequest createCustomerRequest) {
        return customerService.createCustomer(createCustomerRequest);
    }

    /**
     * Get the currently authenticated customer's profile.
     *
     * @param principal the currently logged-in user's security principal
     * @return a response containing the customer's full profile data
     *
     * This endpoint requires authentication.
     */
    @GetMapping
    public CustomerResponse getCustomerById(Principal principal) {
        return customerService.getCustomerById(Long.parseLong(principal.getName()));
    }
}
