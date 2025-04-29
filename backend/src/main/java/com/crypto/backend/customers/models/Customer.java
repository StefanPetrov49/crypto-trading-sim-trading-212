package com.crypto.backend.customers.models;

import java.math.BigDecimal;
import java.util.Date;

public record Customer(
        long id,
        String firstName,
        String lastName,
        String username,
        String password,
        BigDecimal balance,
        Date createdAt,
        Date updatedAt)
{}
