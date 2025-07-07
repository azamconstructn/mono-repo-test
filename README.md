# T3D API - Microservices Monorepo

A modern, scalable microservices architecture built with Node.js, TypeScript, and Docker. This monorepo contains three core services (User, Auth, Notification) with comprehensive monitoring, tracing, and CI/CD pipeline.

## 🏗️ Architecture

```
📁 t3d-api/
├── 📁 services/                    # Microservices
│   ├── 📁 user-service/            # User management & profiles
│   ├── 📁 auth-service/            # Authentication & authorization
│   └── 📁 notification-service/    # Email, push, SMS notifications
├── 📁 packages/                    # Shared packages
│   ├── 📁 core-utils/              # Shared utilities (logger, tracing, etc.)
│   └── 📁 db-models/               # Shared MongoDB schemas
├── 📁 infra/                       # Infrastructure & monitoring
├── 📁 .github/workflows/           # CI/CD pipelines
└── 📁 scripts/                     # Development utilities
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **Docker** & **Docker Compose**
- **Git**

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd t3d-api

# Install dependencies
npm install

# Start monitoring stack
npm run monitoring:up

# Start development services
npm run dev:user
npm run dev:auth
npm run dev:notification
```

### Environment Setup

Create `.env` files for each service:

```env
# Root .env
NODE_ENV=development
MONGODB_URI=mongodb://admin:password123@localhost:27017/t3d_api
RABBITMQ_URL=amqp://admin:password123@localhost:5672
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
JAEGER_ENDPOINT=http://localhost:14268/api/traces
```

## 📋 Available Scripts

### Development

```bash
npm run dev:user          # Start user service
npm run dev:auth          # Start auth service
npm run dev:notification  # Start notification service
```

### Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage
npm run test:user         # Test only user service
npm run test:auth         # Test only auth service
npm run test:notification # Test only notification service
```

### Code Quality

```bash
npm run lint              # Run ESLint
npm run lint:fix          # Fix linting issues
npm run type-check        # TypeScript type checking
npm run format            # Format code with Prettier
npm run format:check      # Check code formatting
```

### Building

```bash
npm run build             # Build all services
npm run clean             # Clean build artifacts
```

### Docker

```bash
npm run docker:build      # Build Docker images
npm run docker:up         # Start services with Docker
npm run docker:down       # Stop Docker services
npm run docker:logs       # View Docker logs
```

### Monitoring

```bash
npm run monitoring:up     # Start monitoring stack
npm run monitoring:down   # Stop monitoring stack
npm run monitoring:logs   # View monitoring logs
```

## 🏛️ Services Architecture

### User Service (Port 3000)

- **Purpose**: User management and profiles
- **Endpoints**: `/users/*`, `/health`
- **Features**: CRUD operations, profile management

### Auth Service (Port 3001)

- **Purpose**: Authentication and authorization
- **Endpoints**: `/auth/*`, `/health`
- **Features**: JWT tokens, refresh tokens, auth logs

### Notification Service (Port 3002)

- **Purpose**: Email, push, and SMS notifications
- **Endpoints**: `/notifications/*`, `/health`
- **Features**: Multi-channel notifications, delivery tracking

## 📦 Shared Packages

### Core Utils (`@t3d/core-utils`)

```typescript
import {
  logger,
  initTracing,
  getRabbitMQClient,
  metricsMiddleware,
} from "@t3d/core-utils";

// Structured logging
logger.info("Service started", { service: "user-service" });

// Distributed tracing
const tracer = initTracing("user-service");
const span = tracer.startSpan("user-operation");

// Message queue
const rabbitMQ = getRabbitMQClient();
await rabbitMQ.publishMessage("user-events", { userId: "123" });

// Prometheus metrics
app.use(metricsMiddleware);
```

### DB Models (`@t3d/db-models`)

```typescript
import { User, RefreshToken, Notification, connectDB } from "@t3d/db-models";

// Connect to database
await connectDB();

// Use models
const user = new User({ email: "user@example.com", password: "hash" });
await user.save();
```

## 🔧 Infrastructure & Monitoring

### Monitoring Stack

- **Grafana** (Port 3000) - Metrics visualization
- **Prometheus** (Port 9090) - Metrics collection
- **Jaeger** (Port 16686) - Distributed tracing
- **RabbitMQ** (Port 15672) - Message queue management
- **Kibana** (Port 5601) - Log visualization
- **Elasticsearch** (Port 9200) - Log aggregation

### Access Credentials

- **Grafana**: admin/admin123
- **RabbitMQ**: admin/password123
- **MongoDB**: admin/password123

### Health Checks

```bash
# Service health
curl http://localhost:3000/health  # User service
curl http://localhost:3001/health  # Auth service
curl http://localhost:3002/health  # Notification service

# Metrics endpoints
curl http://localhost:3000/metrics
curl http://localhost:3001/metrics
curl http://localhost:3002/metrics
```

## 🧪 Testing

### Test Structure

```
services/
├── user-service/
│   ├── __tests__/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── integration/
│   └── src/
```

### Running Tests

```bash
# All tests
npm test

# Specific service
npm run test:user

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Utilities

```typescript
import { testUtils } from "../jest.setup";

const req = testUtils.createMockRequest({
  body: { email: "test@example.com" },
});
const res = testUtils.createMockResponse();
const next = testUtils.createMockNext();
```

## 📚 API Documentation

Each service includes Swagger documentation:

- **User Service**: http://localhost:3000/api-docs
- **Auth Service**: http://localhost:3001/api-docs
- **Notification Service**: http://localhost:3002/api-docs

### Example API Usage

```bash
# Create user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Send notification
curl -X POST http://localhost:3002/notifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"type":"email","title":"Welcome","message":"Welcome to our platform!"}'
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

1. **Lint** - ESLint and TypeScript checks
2. **Test** - Jest tests with coverage
3. **Build** - TypeScript compilation
4. **Security** - npm audit and Snyk scanning
5. **Docker** - Build and push images
6. **Deploy** - Deploy to staging/production

### Deployment Environments

- **Staging**: Automatic deployment from `develop` branch
- **Production**: Manual deployment from `main` branch

## 🐳 Docker

### Development

```bash
# Build development images
docker-compose -f docker-compose.dev.yml build

# Start development environment
docker-compose -f docker-compose.dev.yml up -d
```

### Production

```bash
# Build production images
docker-compose build

# Start production environment
docker-compose up -d
```

### Custom Images

```bash
# Build specific service
docker build -f services/user-service/Dockerfile -t t3d-user-service .

# Run with custom environment
docker run -p 3000:3000 -e NODE_ENV=production t3d-user-service
```

## 🔍 Monitoring & Observability

### Metrics (Prometheus)

- HTTP request duration and count
- Database operation metrics
- Message queue metrics
- Custom business metrics

### Tracing (Jaeger)

- Distributed request tracing
- Service dependency mapping
- Performance bottleneck identification

### Logging (Winston + ELK)

- Structured JSON logging
- Log aggregation with Elasticsearch
- Log visualization with Kibana

### Health Monitoring

- Service health checks
- Database connectivity
- External service dependencies

## 🛠️ Development Guidelines

### Code Style

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Conventional commits** for commit messages

### Project Structure

```
service/
├── src/
│   ├── controllers/     # HTTP request handlers
│   ├── services/        # Business logic
│   ├── routes/          # Express routes
│   ├── domain/          # TypeScript interfaces
│   ├── infrastructure/  # Database models
│   └── index.ts         # Application entry point
├── __tests__/           # Test files
├── Dockerfile           # Production Docker image
├── Dockerfile.dev       # Development Docker image
└── package.json         # Service dependencies
```

### Adding New Services

1. Create service directory in `services/`
2. Add service to workspace in root `package.json`
3. Create Dockerfiles (production and development)
4. Add service to CI/CD pipeline
5. Update monitoring configuration
6. Add service documentation

### Adding New Packages

1. Create package directory in `packages/`
2. Add package to workspace in root `package.json`
3. Create TypeScript configuration
4. Add package to build pipeline
5. Update documentation

## 🔐 Security

### Authentication

- JWT-based authentication
- Refresh token rotation
- Password hashing with bcrypt
- Account lockout protection

### Authorization

- Role-based access control (RBAC)
- Route-level permissions
- API key management

### Data Protection

- Input validation and sanitization
- SQL injection prevention
- XSS protection with helmet
- CORS configuration

## 📊 Performance

### Optimization Strategies

- Database indexing
- Connection pooling
- Caching with Redis
- Message queue for async operations
- Load balancing ready

### Monitoring

- Real-time performance metrics
- Database query optimization
- Memory usage tracking
- Response time monitoring

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and add tests
4. Run linting and tests (`npm run lint && npm test`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Create Pull Request

### Code Review Checklist

- [ ] Tests pass
- [ ] Code is linted and formatted
- [ ] TypeScript types are correct
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance impact considered

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- **Documentation**: Check this README and API docs
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Email**: support@t3d-api.com

### Troubleshooting

#### Common Issues

1. **Port conflicts**: Ensure ports 3000-3002, 27017, 5672, 6379 are available
2. **Database connection**: Check MongoDB is running and credentials are correct
3. **Docker issues**: Ensure Docker is running and has sufficient resources
4. **Permission errors**: Run `sudo chown -R $USER:$USER .` in project directory

#### Debug Commands

```bash
# Check service status
docker-compose ps

# View service logs
docker-compose logs -f [service-name]

# Check database connection
docker exec -it t3d-mongodb mongosh

# Monitor system resources
docker stats
```

## 🎯 Roadmap

### Planned Features

- [ ] GraphQL API support
- [ ] WebSocket real-time notifications
- [ ] Multi-tenant architecture
- [ ] Advanced caching strategies
- [ ] Service mesh integration
- [ ] Kubernetes deployment
- [ ] Advanced analytics dashboard
- [ ] A/B testing framework

### Performance Improvements

- [ ] Database query optimization
- [ ] Redis clustering
- [ ] CDN integration
- [ ] Image optimization
- [ ] API rate limiting
- [ ] Circuit breaker pattern

---

**Built with ❤️ by the T3D API Team**
