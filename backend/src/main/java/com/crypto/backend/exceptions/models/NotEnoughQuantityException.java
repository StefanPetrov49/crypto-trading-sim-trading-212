package com.crypto.backend.exceptions.models;

public class NotEnoughQuantityException extends RuntimeException
{
    public NotEnoughQuantityException(String message)
    {
        super(message);
    }
}
