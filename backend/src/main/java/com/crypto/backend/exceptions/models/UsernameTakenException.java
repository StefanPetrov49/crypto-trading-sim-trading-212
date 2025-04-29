package com.crypto.backend.exceptions.models;

public class UsernameTakenException extends RuntimeException
{

    public UsernameTakenException(String message)
    {
        super(message);
    }
}
