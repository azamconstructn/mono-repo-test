# T3D API Docker Setup

This document provides instructions for running the T3D API microservices using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Make (optional, for using Makefile commands)

## Quick Start

### Development Environment

```bash
# Start development environment with hot reloading
make dev

# Or manually:
docker-compose -f docker-compose.dev.yml up -d
```

### Production Environment

```bash
# Start production environment
make prod

# Or manually:
docker-compose up -d
```

## Service Architecture

The application consists of the following services:

- **User Service** (Port 3000) - User management and profiles
- **Auth Service** (Port 3001) - Authentication and authorization
- **Notification Service** (Port 3002) - Email and push notifications
- **PostgreSQL** (Port 5432) - Primary database
- **Redis** (Port 6379) - Caching and session storage
- **Nginx** (Port 80/443) - Reverse proxy and load balancer

## Docker Files Structure

```
services/
├── user-service/
│   ├── Dockerfile          # Production build
│   └── Dockerfile.dev      # Development build
├── auth-service/
│   ├── Dockerfile          # Production build
│   └── Dockerfile.dev      # Development build
└── notification-service/
    ├── Dockerfile          # Production build
    └── Dockerfile.dev      # Development build
```

## Available Commands

### Using Makefile (Recommended)

```bash
# Show all available commands
make help

# Development commands
make build-dev    # Build development images
make up-dev       # Start development services
make down-dev     # Stop development services
make logs-dev     # View development logs
make clean-dev    # Clean development environment

# Production commands
make build        # Build production images
make up           # Start production services
make down         # Stop production services
make logs         # View production logs
make clean        # Clean production environment

# Individual service builds
make build-user
make build-auth
make build-notification

# Health checks
make health

# Database operations
make db-backup
make db-restore file=backup.sql
```

### Using Docker Compose Directly

```bash
# Development
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml logs -f
docker-compose -f docker-compose.dev.yml down

# Production
docker-compose up -d
docker-compose logs -f
docker-compose down
```

## Environment Variables

### Production Environment Variables

Create a `.env` file in the root directory:

```env
# Database
POSTGRES_DB=t3d_api
POSTGRES_USER=t3d_user
POSTGRES_PASSWORD=your-secure-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Service Ports
USER_SERVICE_PORT=3000
AUTH_SERVICE_PORT=3001
NOTIFICATION_SERVICE_PORT=3002
```

### Development Environment Variables

Create a `.env.dev` file:

```env
# Database
POSTGRES_DB=t3d_api_dev
POSTGRES_USER=t3d_user_dev
POSTGRES_PASSWORD=dev_password

# JWT Configuration
JWT_SECRET=dev-jwt-secret-key
JWT_EXPIRES_IN=24h

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=dev-email@gmail.com
SMTP_PASS=dev-app-password

# Debug
DEBUG=*
```

## Development Features

### Hot Reloading

The development environment includes hot reloading using `ts-node-dev`. Any changes to TypeScript files will automatically restart the services.

### Volume Mounting

Development containers mount the source code as volumes, allowing for real-time code changes without rebuilding images.

### Database Management

Access the database through Adminer at `http://localhost:8080` in development mode.

## Production Features

### Multi-stage Builds

Production Dockerfiles use multi-stage builds to optimize image size and security.

### Health Checks

All services include health checks that monitor service availability.

### Security

- Non-root user execution
- Minimal base images (Alpine Linux)
- Production-only dependencies

## Monitoring and Logs

### View Logs

```bash
# All services
make logs

# Specific service
docker-compose logs -f user-service

# Development logs
make logs-dev
```

### Health Monitoring

```bash
# Check service health
make health

# Individual service health
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000-3002, 5432, 6379, 80, and 443 are available
2. **Permission issues**: Run `sudo chown -R $USER:$USER .` in the project directory
3. **Build failures**: Clean and rebuild with `make clean && make build`

### Debug Commands

```bash
# Check container status
docker-compose ps

# Inspect container logs
docker-compose logs [service-name]

# Access container shell
docker-compose exec [service-name] sh

# Check resource usage
docker stats
```

### Reset Environment

```bash
# Complete reset (development)
make clean-dev

# Complete reset (production)
make clean

# Reset only volumes
docker-compose down -v
```

## Performance Optimization

### Build Optimization

- Use `.dockerignore` to exclude unnecessary files
- Leverage Docker layer caching
- Use multi-stage builds for smaller images

### Runtime Optimization

- Use Alpine Linux base images
- Implement proper health checks
- Configure resource limits in production

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to version control
2. **Secrets Management**: Use Docker secrets or external secret management in production
3. **Network Security**: Use custom networks and restrict container communication
4. **Image Security**: Regularly update base images and scan for vulnerabilities

## Next Steps

1. Configure SSL certificates for production
2. Set up monitoring and alerting (Prometheus, Grafana)
3. Implement CI/CD pipeline for automated deployments
4. Configure backup strategies for databases
5. Set up load balancing and auto-scaling
