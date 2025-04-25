.PHONY: build-backend migrate test lint

shell:
	docker compose -f docker-compose.dev.yaml run --rm backend shell -v 2

migrations:
	docker compose -f docker-compose.dev.yaml run --rm backend makemigrations

migrate:
	docker compose -f docker-compose.dev.yaml run --rm backend migrate

run: migrate
	docker compose -f docker-compose.dev.yaml up -d

logs:
	docker compose -f docker-compose.dev.yaml logs -f

build:
	docker compose -f docker-compose.dev.yaml build

clean:
	docker compose -f docker-compose.dev.yaml down

tests:
	docker compose -f docker-compose.dev.yaml run --rm backend test

build-backend:
	docker compose -f docker-compose.dev.yaml build backend