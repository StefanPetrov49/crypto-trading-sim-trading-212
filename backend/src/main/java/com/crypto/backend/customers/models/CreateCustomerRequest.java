package com.crypto.backend.customers.models;

public record CreateCustomerRequest(String firstName, String lastName,
                                    String username, String password)
{
}
