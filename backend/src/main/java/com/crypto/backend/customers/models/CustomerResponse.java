package com.crypto.backend.customers.models;

import java.math.BigDecimal;

public record CustomerResponse(long customerId, String firstName, String lastName,
                               String username, BigDecimal balance)
{
}
