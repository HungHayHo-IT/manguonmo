# EazyStore – Full-Stack E-Commerce Application

EazyStore is a full-stack e-commerce web application built with **Spring Boot** and **React**. It provides product browsing, customer authentication, shopping cart and checkout workflows, order management, customer profile management, and an admin interface for managing products and orders.

The project is structured as two applications:
- **Backend:** REST API built with Spring Boot.
- **Frontend:** Single-page application built with React and Vite.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Overview](#api-overview)
- [Security](#security)
- [Payment Integration](#payment-integration)
- [Development](#development)
- [Future Improvements](#future-improvements)

## Features

### Customer
- Browse the product catalog.
- View product details and search products.
- Register and sign in.
- Manage customer profile information.
- Add products to a cart and proceed through checkout.
- Create orders and view order history.
- Submit contact messages.

### Administration
- Manage products through admin functionality.
- View and manage customer orders.
- Review contact messages.

### Backend and application capabilities
- RESTful API endpoints.
- Authentication and authorization with Spring Security and JWT.
- Role-based access control.
- Persistence with Spring Data JPA.
- Request validation and centralized exception handling.
- API documentation with Springdoc OpenAPI.
- Application health and monitoring endpoints with Spring Boot Actuator.
- Caffeine-based in-memory caching.
- Stripe integration for payment workflows.
- Audit fields for tracking record creation and updates.

> Note: Available features and access permissions depend on the current implementation and configuration. Payment processing requires valid Stripe test credentials.

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.4.3
- Spring Web
- Spring Security
- Spring Data JPA / Hibernate
- Microsoft SQL Server JDBC driver (included in the current Maven configuration)
- JWT (JJWT)
- Stripe Java SDK
- Caffeine Cache
- Spring Boot Actuator
- Springdoc OpenAPI
- Maven
- Lombok

### Frontend
- React 19
- Vite 6
- JavaScript (ES Modules)
- React Router
- Redux Toolkit and React Redux
- Axios
- Tailwind CSS 4
- Stripe.js and React Stripe.js
- React Toastify
- Font Awesome

## Project Structure

```text
manguonmo/
├── .env.example
├── eazystore/
│   ├── pom.xml
│   ├── mvnw
│   └── src/
│       ├── main/
│       │   ├── java/com/eazybytes/eazystore/
│       │   │   ├── config/       # Application and integration configuration
│       │   │   ├── controller/   # REST API controllers
│       │   │   ├── dto/          # Request and response DTOs
│       │   │   ├── entity/       # JPA entities
│       │   │   ├── exception/    # Exception handling
│       │   │   ├── filter/       # JWT validation filter
│       │   │   ├── repository/   # Data access layer
│       │   │   ├── security/     # Authentication and authorization
│       │   │   ├── service/      # Service interfaces and implementations
│       │   │   └── util/         # Utility classes
│       │   └── resources/
│       │       └── sql/          # Database schema and sample data
│       └── test/
└── eazystore-ui/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── api/                 # API client and service modules
        ├── components/          # UI components and pages
        ├── assets/              # Local frontend assets
        └── ...
```

## Architecture Overview

The application follows a typical frontend–backend architecture:

1. A customer interacts with the React frontend.
2. The frontend calls backend REST APIs through Axios.
3. Spring Security processes authentication and authorization for protected endpoints.
4. Controllers receive requests and delegate business operations to service classes.
5. Services use Spring Data JPA repositories to access the database.
6. The backend returns responses to the frontend, which updates the UI.

```text
React + Vite
     |
     | HTTP / JSON
     v
Spring Boot REST API
     |
     +---- Spring Security / JWT
     |
     +---- Controller
              |
              v
           Service
              |
              v
        Spring Data JPA
              |
              v
          SQL Server

Spring Boot ---- Stripe payment integration
```

## Getting Started

### Prerequisites

Install the following tools before running the application:

- JDK 17
- Node.js and npm
- Microsoft SQL Server
- Git
- Maven (optional, because the backend includes the Maven Wrapper)
- Stripe test account credentials if you want to test payment functionality

### 1. Clone the repository

```bash
git clone https://github.com/HungHayHo-IT/manguonmo.git
cd manguonmo
```

### 2. Configure the database and backend

Open the backend project:

```bash
cd eazystore
```

Configure the database connection and application settings in the backend's configuration file. The project includes SQL scripts under:

- `src/main/resources/sql/schema.sql`
- `src/main/resources/sql/data.sql`

Review these scripts before running them. **Important:** the Maven configuration currently includes the Microsoft SQL Server JDBC driver, while the checked-in `schema.sql` uses MySQL-style syntax (for example, `AUTO_INCREMENT` and `CREATE TABLE IF NOT EXISTS`). Confirm which database the application is configured to use, then align the JDBC driver, connection settings, and SQL scripts before initializing the database. Do not assume these scripts can run unchanged on SQL Server.

The checked-in `.env.example` documents the expected Stripe and database password variables. Copy it to a local `.env` file at the repository root and fill in your own development values. **Do not commit real credentials or API secret keys.** Verify how your local Spring configuration loads environment variables before starting the backend.

Configure at least the following values according to your local setup:
- Database URL, username, and password.
- Stripe secret and publishable keys for test mode.
- Any application-specific security settings required by the backend configuration.

Start the backend on the port configured by the application:

Windows:
```powershell
.\mvnw.cmd spring-boot:run
```

Linux/macOS:
```bash
./mvnw spring-boot:run
```

If the Maven Wrapper cannot run on Linux/macOS, make it executable first:

```bash
chmod +x mvnw
./mvnw spring-boot:run
```

### 3. Configure and start the frontend

Open a second terminal from the repository root:

```bash
cd eazystore-ui
npm install
```

Configure the frontend API base URL in the frontend environment file. The current local value in the repository is:

```env
VITE_API_BASE_URL=http://localhost:8888/api/v1
```

Ensure this URL matches the host and port where your backend is actually running. If the backend uses a different port, update the variable before starting the frontend.

Start the Vite development server:

```bash
npm run dev
```

Vite prints the local frontend URL in the terminal after startup.

### 4. Verify the application

1. Confirm the backend starts successfully and can connect to the database.
2. Confirm the frontend starts and points to the correct API base URL.
3. Open the frontend URL printed by Vite.
4. Test product browsing, registration/login, cart and checkout flows.
5. Configure Stripe test keys before testing payment-related workflows.

## Configuration

### Backend environment

The root `.env.example` includes placeholders for:

```env
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLIC_KEY=pk_test_your_key_here
DB_PASSWORD=your_password_here
```

These are placeholders only. Set real development values in your local environment and confirm that the backend's Spring configuration uses the corresponding variable names.

### Frontend environment

File: `eazystore-ui/.env`

```env
VITE_API_BASE_URL=http://localhost:8888/api/v1
```

Vite exposes variables prefixed with `VITE_` to frontend code. Do not put private keys or other secrets in frontend environment variables.

## API Overview

The backend exposes REST endpoints under the `/api/v1` base path. The following routes are visible in the current source code:

| Area | Endpoint | Purpose |
|---|---|---|
| Authentication | `/api/v1/auth` | Customer authentication and registration workflows |
| Products | `GET /api/v1/products` | Retrieve the product catalog |
| Products | `POST /api/v1/products` | Create a product; intended for authorized administrators |
| Products | `DELETE /api/v1/products/{id}` | Delete a product |
| Orders | `/api/v1/orders` | Create orders and retrieve customer order history |
| Payments | `/api/v1` payment routes | Payment-related operations; see PaymentController |
| Profile | `/api/v1` profile routes | Customer profile operations; see ProfileController |

The exact request and response formats are defined by the DTO classes in `eazystore/src/main/java/com/eazybytes/eazystore/dto`.

### API documentation

The project includes Springdoc OpenAPI. When the backend is running, try the Swagger UI endpoint:

```text
http://localhost:<backend-port>/swagger-ui/index.html
```

Replace `<backend-port>` with the port configured for your backend.

## Security

Security-related implementation includes:

- Spring Security configuration.
- JWT validation filter and JWT utility.
- Authentication endpoints.
- Role entities and customer-role relationships.
- Method-level authorization annotations on selected endpoints.

For local development, use test accounts and non-production secrets. Before deploying publicly, review every write endpoint and ensure authorization is enabled where required. In particular, verify product deletion, order ownership checks, payment validation, CORS, CSRF handling, password encoding, and secret management.

## Payment Integration

The application uses Stripe libraries on both the backend and frontend. To test payment functionality:

1. Create or use a Stripe account in test mode.
2. Configure the backend Stripe secret key.
3. Configure the appropriate publishable key in the frontend if required by the checkout flow.
4. Use Stripe's test payment details and verify the payment result in the application.

Never use production payment credentials for local development or commit secret keys to Git.

## Development

### Backend

Run tests:

Windows:
```powershell
.\mvnw.cmd test
```

Linux/macOS:
```bash
./mvnw test
```

### Frontend

Run the linter:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Preview a production build locally:

```bash
npm run preview
```

## Future Improvements

Potential next steps for the project:

- Add automated unit and integration tests for critical business workflows.
- Add Dockerfiles and Docker Compose for repeatable local setup.
- Add a CI pipeline to run backend tests and frontend lint/build checks.
- Improve API error response consistency and request validation.
- Review role-based authorization and order ownership checks across all endpoints.
- Add pagination, filtering, and sorting for product and order APIs.
- Add deployment instructions and screenshots of the application.
- Document sample data and safe demo credentials, if a demo account is provided.

## Author

**HungHayHo-IT**

GitHub: [https://github.com/HungHayHo-IT](https://github.com/HungHayHo-IT)

---

This repository is a learning and portfolio project. Review configuration, security, and payment workflows carefully before using it in a production environment.
