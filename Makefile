# Makefile for T3D API Docker Operations

.PHONY: help build build-dev up up-dev down down-dev logs logs-dev clean clean-dev restart restart-dev

# Default target
help:
	@echo "Available commands:"
	@echo "  build      - Build production Docker images"
	@echo "  build-dev  - Build development Docker images"
	@echo "  up         - Start production services"
	@echo "  up-dev     - Start development services"
	@echo "  down       - Stop production services"
	@echo "  down-dev   - Stop development services"
	@echo "  logs       - Show production logs"
	@echo "  logs-dev   - Show development logs"
	@echo "  clean      - Clean production volumes and images"
	@echo "  clean-dev  - Clean development volumes and images"
	@echo "  restart    - Restart production services"
	@echo "  restart-dev- Restart development services"

# Production commands
build:
	docker-compose build --no-cache

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v --rmi all
	docker system prune -f

restart:
	docker-compose restart

# Development commands
build-dev:
	docker-compose -f docker-compose.dev.yml build --no-cache

up-dev:
	docker-compose -f docker-compose.dev.yml up -d

down-dev:
	docker-compose -f docker-compose.dev.yml down

logs-dev:
	docker-compose -f docker-compose.dev.yml logs -f

clean-dev:
	docker-compose -f docker-compose.dev.yml down -v --rmi all
	docker system prune -f

restart-dev:
	docker-compose -f docker-compose.dev.yml restart

# Individual service commands
build-user:
	docker-compose build user-service

build-auth:
	docker-compose build auth-service

build-notification:
	docker-compose build notification-service

# Database commands
db-backup:
	docker exec t3d-postgres pg_dump -U t3d_user t3d_api > backup_$(shell date +%Y%m%d_%H%M%S).sql

db-restore:
	docker exec -i t3d-postgres psql -U t3d_user t3d_api < $(file)

# Health checks
health:
	@echo "Checking service health..."
	@curl -f http://localhost:3000/health || echo "User service: DOWN"
	@curl -f http://localhost:3001/health || echo "Auth service: DOWN"
	@curl -f http://localhost:3002/health || echo "Notification service: DOWN"

# Development shortcuts
dev: up-dev
	@echo "Development environment started!"
	@echo "User Service: http://localhost:3000"
	@echo "Auth Service: http://localhost:3001"
	@echo "Notification Service: http://localhost:3002"
	@echo "Adminer (Database): http://localhost:8080"

prod: up
	@echo "Production environment started!"
	@echo "User Service: http://localhost:3000"
	@echo "Auth Service: http://localhost:3001"
	@echo "Notification Service: http://localhost:3002" 