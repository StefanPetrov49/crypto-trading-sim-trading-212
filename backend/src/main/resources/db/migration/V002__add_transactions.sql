CREATE TABLE IF NOT EXISTS `crypto_symbols`
(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `symbol` VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS `transactions_history`
(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `customer_id` INT NOT NULL,
    `crypto_symbol_id` INT NOT NULL,
    `bought_at_price` DECIMAL(10, 2) NULL,
    `sold_at_price` DECIMAL(10, 2)  NULL,
    `quantity` DOUBLE NOT NULL,
    `action` ENUM('BUY', 'SELL') NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT `fk_transactions_history_customers` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_transactions_history_crypto_symbols` FOREIGN KEY (`crypto_symbol_id`) REFERENCES `crypto_symbols` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
);