# Java Requirements
Java 17+
Maven 3.6+

# Database
MariaDB (tested with: 10.x or later)
Database names:
- crypto_db (production)
- crypto_db_test (tests)

# Environment Setup
Spring Boot 3.2.4
Flyway for database migrations
Mariadb JDBC driver
Jackson for JSON binding

# Spring Boot Starters
spring-boot-starter-web
spring-boot-starter-data-jdbc
spring-boot-starter-security
spring-boot-starter-test
spring-boot-starter-websocket

# Testing
JUnit 5.10.1

# OpenAPI/Swagger UI
springdoc-openapi-starter-webmvc-ui:2.5.0

# JWT Support
jjwt-api:0.11.5
jjwt-impl:0.11.5
jjwt-jackson:0.11.5

# Configuration files
application.yml (production profile)
application-test.yml (test profile)

# Flyway
Flyway migration scripts should be in: src/main/resources/db/migration

# URLs
Backend runs at: http://localhost:8080
Swagger UI available at: http://localhost:8080/swagger-ui.html
