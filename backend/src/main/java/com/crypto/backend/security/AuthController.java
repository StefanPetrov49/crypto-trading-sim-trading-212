package com.crypto.backend.security;

import com.crypto.backend.customers.models.Customer;
import com.crypto.backend.customers.repository.CustomerDAO;
import com.crypto.backend.security.models.LoginRequest;
import com.crypto.backend.security.models.LoginResponse;
import com.crypto.backend.security.utils.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController
{

    private final CustomerDAO customerDAO;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public AuthController(CustomerDAO customerDAO, JwtUtil jwtUtil, BCryptPasswordEncoder bCryptPasswordEncoder)
    {
        this.customerDAO = customerDAO;
        this.jwtUtil = jwtUtil;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request)
    {
        Optional<Customer> customerOpt = customerDAO.findByUsername(request.username());

        if (customerOpt.isPresent())
        {
            Customer customer = customerOpt.get();
            if (bCryptPasswordEncoder.matches(request.password(), customer.password()))
            {
                String token = jwtUtil.generateToken(customer.id());
                return ResponseEntity.ok(new LoginResponse(token));
            }
        }
        return ResponseEntity.status(401).build();
    }
}


