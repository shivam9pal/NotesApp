# Spring Boot Application

A comprehensive Spring Boot application with modern features and best practices.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Setup](#database-setup)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

- RESTful API endpoints
- Spring Security integration
- Database integration (JPA/Hibernate)
- Input validation
- Exception handling
- Logging configuration
- Unit and integration tests
- Docker support
- API documentation with Swagger/OpenAPI

## 🔧 Prerequisites

Before running this application, make sure you have the following installed:

- **Java 17** or higher
- **Maven 3.6+** or **Gradle 7+**
- **MySQL 8.0+** / **PostgreSQL 12+** (or your preferred database)
- **Docker** (optional, for containerized deployment)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/your-spring-boot-app.git
   cd your-spring-boot-app
   ```

2. **Install dependencies**
   
   Using Maven:
   ```bash
   mvn clean install
   ```
   
   Using Gradle:
   ```bash
   ./gradlew build
   ```

## ⚙️ Configuration

### Database Configuration

1. **Create a database** (MySQL example):
   ```sql
   CREATE DATABASE your_app_db;
   CREATE USER 'your_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON your_app_db.* TO 'your_user'@'localhost';
   ```

2. **Update application properties**
   
   Copy the example configuration:
   ```bash
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   ```
   
   Update `src/main/resources/application.properties`:
   ```properties
   # Database Configuration
   spring.datasource.url=jdbc:mysql://localhost:3306/your_app_db
   spring.datasource.username=your_user
   spring.datasource.password=your_password
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   
   # JPA/Hibernate Configuration
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.format_sql=true
   
   # Server Configuration
   server.port=8080
   
   # Logging Configuration
   logging.level.com.yourcompany.yourapp=DEBUG
   logging.level.org.springframework.security=DEBUG
   ```

### Environment Variables

You can also use environment variables for sensitive configuration:

```bash
export DB_HOST=localhost
export DB_PORT=port
export DB_NAME=your_app_db
export DB_USERNAME=your_user
export DB_PASSWORD=your_password
export JWT_SECRET=your_jwt_secret
```

## 🚀 Running the Application

### Development Mode

Using Maven:
```bash
mvn spring-boot:run
```

Using Gradle:
```bash
./gradlew bootRun
```

Using Java:
```bash
# First, build the application
mvn clean package
# Then run the JAR
java -jar target/your-app-name-0.0.1-SNAPSHOT.jar
```

### Development with Hot Reload

Add Spring Boot DevTools dependency and run:
```bash
mvn spring-boot:run
```

The application will automatically restart when you make changes to the code.

### Using Docker

1. **Build the Docker image**:
   ```bash
   docker build -t your-spring-boot-app .
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

The application will be available at `http://localhost:8080`

## 📖 API Documentation



### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/users` | Get all users |
| POST   | `/api/users` | Create a new user |
| GET    | `/api/users/{id}` | Get user by ID |
| PUT    | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |
| POST   | `/api/auth/login` | User login |
| POST   | `/api/auth/register` | User registration |

### Authentication

This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8080/api/users
```

### Example API Calls

**Register a new user**:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securePassword123"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
     "username": "john_doe",
    "password": "securePassword123"
  }'
```

## 🗄️ Database Setup

### Database Migrations

This application uses Flyway for database migrations. Migration files are located in `src/main/resources/db/migration/`.

**Run migrations manually**:
```bash
mvn flyway:migrate
```

### Sample Data

To load sample data for development:
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

## 🧪 Testing

### Unit Tests

```bash
mvn test
```

### Integration Tests

```bash
mvn verify
```

### Test Coverage

Generate test coverage report:
```bash
mvn jacoco:report
```

View the report at `target/site/jacoco/index.html`

### API Testing

You can test the API endpoints using:
- **Postman**: Import the collection from `/postman/api-collection.json`
- **curl**: Use the examples provided above

## 🚢 Deployment

### Production Build

```bash
mvn clean package -Pprod
```

### Docker Deployment

1. **Build production image**:
   ```bash
   docker build -f Dockerfile.prod -t your-app:prod .
   ```

2. **Deploy with Docker Compose**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Cloud Deployment

#### AWS EC2
```bash
# Build the JAR
mvn clean package

# Transfer to EC2
scp target/your-app.jar ec2-user@your-server:/home/ec2-user/

# Run on server
java -jar your-app.jar --spring.profiles.active=prod
```

#### Heroku
```bash
# Install Heroku CLI and login
heroku create your-app-name
git push heroku main
```

### Environment-Specific Configuration

Create different property files for different environments:
- `application-dev.properties` - Development
- `application-test.properties` - Testing
- `application-prod.properties` - Production

## 🔧 Configuration Details

### Security Configuration

The application includes:
- JWT-based authentication
- Password encryption using BCrypt
- CORS configuration
- Rate limiting
- Input validation



Enable additional actuator endpoints in production:
```properties
management.endpoints.web.exposure.include=health,info,metrics
```

## 📝 Logging

Logs are configured to output to:
- Console (development)
- File: `logs/application.log`
- External logging service (production)

Log levels can be configured per package:
```properties
logging.level.com.yourcompany.yourapp=INFO
logging.level.org.springframework.web=DEBUG
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/shivam9pal/NotesApp/issues) page
2. Create a new issue with detailed information
3. Contact the developer: [shivam9pal](https://github.com/shivam9pal)

## 🔗 Useful Links

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Reference](https://spring.io/projects/spring-security)
- [JPA/Hibernate Guide](https://spring.io/guides/gs/accessing-data-jpa/)
- [Docker Documentation](https://docs.docker.com/)

---

**Happy Coding! 🎉**