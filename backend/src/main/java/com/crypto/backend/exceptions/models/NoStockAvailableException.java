package com.crypto.backend.exceptions.models;

public class NoStockAvailableException extends RuntimeException
{
    public NoStockAvailableException(String message)
    {
        super(message);
    }
}
