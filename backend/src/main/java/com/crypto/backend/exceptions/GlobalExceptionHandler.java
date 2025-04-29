package com.crypto.backend.exceptions;

import com.crypto.backend.exceptions.models.InsufficientFundsException;
import com.crypto.backend.exceptions.models.NoStockAvailableException;
import com.crypto.backend.exceptions.models.NotEnoughQuantityException;
import com.crypto.backend.exceptions.models.UsernameTakenException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler
{

    @ExceptionHandler(InsufficientFundsException.class)
    public ResponseEntity<String> handleInsufficientFunds(InsufficientFundsException ex)
    {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

    @ExceptionHandler(UsernameTakenException.class)
    public ResponseEntity<String> handleUsernameTaken(UsernameTakenException ex)
    {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

    @ExceptionHandler(NoStockAvailableException.class)
    public ResponseEntity<String> handleNoStockAvailable(NoStockAvailableException ex)
    {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

    @ExceptionHandler(NotEnoughQuantityException.class)
    public ResponseEntity<String> handleNotEnoughQuantity(NotEnoughQuantityException ex)
    {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }
}
