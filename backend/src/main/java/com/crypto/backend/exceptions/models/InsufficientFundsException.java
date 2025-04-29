package com.crypto.backend.exceptions.models;

public class InsufficientFundsException extends RuntimeException
{

    public InsufficientFundsException(String message)
    {
        super(message);
    }
}
