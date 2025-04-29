package com.crypto.backend.transactions;

import com.crypto.backend.customers.models.CustomerResponse;
import com.crypto.backend.transactions.models.TransactionHistory;
import com.crypto.backend.transactions.models.TransactionRequest;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;


@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    /**
     * Get the transaction history for the currently authenticated customer.
     *
     * @param principal the currently logged-in user's security principal
     * @return a list of transaction records including buy/sell actions, quantities, and prices
     */
    @GetMapping
    public List<TransactionHistory> getTransactionHistoryByCustomerId(Principal principal) {
        return transactionService.getTransactionHistoryByCustomerId(Long.parseLong(principal.getName()));
    }

    /**
     * Perform a cryptocurrency purchase for the authenticated customer.
     *
     * @param transactionRequest the cryptocurrency symbol and quantity to buy
     * @param principal the currently logged-in user's security principal
     * @return the updated customer profile with new balance after the purchase
     *
     * Example request body:
     * {
     *   "cryptoSymbol": "BTC",
     *   "quantity": 0.05
     * }
     */
    @PostMapping("/buy")
    public CustomerResponse buy(@RequestBody TransactionRequest transactionRequest, Principal principal) {
        return transactionService.buy(Long.parseLong(principal.getName()), transactionRequest);
    }

    /**
     * Perform a cryptocurrency sale for the authenticated customer.
     *
     * @param transactionRequest the cryptocurrency symbol and quantity to sell
     * @param principal the currently logged-in user's security principal
     * @return the updated customer profile with new balance after the sale
     */
    @PostMapping("/sell")
    public CustomerResponse sell(@RequestBody TransactionRequest transactionRequest, Principal principal) {
        return transactionService.sell(Long.parseLong(principal.getName()), transactionRequest);
    }

    /**
     * Reset the authenticated customer's profile (e.g., balance and holdings).
     *
     * @param principal the currently logged-in user's security principal
     * @return the updated customer profile after reset
     */
    @PutMapping("/reset")
    public CustomerResponse resetCustomer(Principal principal) {
        return transactionService.resetCustomer(Long.parseLong(principal.getName()));
    }
}
