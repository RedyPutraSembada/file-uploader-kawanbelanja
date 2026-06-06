# ==========================================
# Makefile Uploader - Multi Environment
# ==========================================

DOCKER_COMPOSE = docker compose

# Default ENV jika tidak didefinisikan (contoh: make deploy ENV=prod-id)
ENV ?= stg-id

# --- Logika Mapping Environment ---
# Kita tentukan variabel berdasarkan input ENV
ifeq ($(ENV),stg-id)
    COMPOSE_FILE := docker-compose.stg-id.yml
    ENV_FILE     := .env.stg_id_uploader.local
    PROJECT_NAME := uploader-stg-id
else ifeq ($(ENV),prod-id)
    COMPOSE_FILE := docker-compose.prod-id.yml
    ENV_FILE     := .env.prod_id_uploader.local
    PROJECT_NAME := uploader-prod-id
else ifeq ($(ENV),stg-v2)
    COMPOSE_FILE := docker-compose.stg-v2.yml
    ENV_FILE     := .env.stg_v2_uploader.local
    PROJECT_NAME := uploader-stg-v2
else ifeq ($(ENV),prod-v2)
    COMPOSE_FILE := docker-compose.prod-v2.yml
    ENV_FILE     := .env.prod_v2_uploader.local
    PROJECT_NAME := uploader-prod-v2
else
    $(error ENV "$(ENV)" tidak valid! Gunakan: stg-id, prod-id, stg-v2, atau prod-v2)
endif

# Base Command untuk menyingkat penulisan
# Flag -p sangat penting agar container environment lain tidak kena "remove-orphans"
CMD_BASE := $(DOCKER_COMPOSE) -p $(PROJECT_NAME) --env-file $(ENV_FILE) -f $(COMPOSE_FILE)

.PHONY: deploy logs stop restart clean help

deploy:
	@echo "🚀 Deploying project: $(PROJECT_NAME)..."
	$(CMD_BASE) up -d --build --remove-orphans --quiet-pull

logs:
	@echo "📋 Showing logs for: $(PROJECT_NAME)..."
	$(CMD_BASE) logs -f --timestamps

stop:
	@echo "🛑 Stopping project: $(PROJECT_NAME)..."
	$(CMD_BASE) down

restart:
	@echo "🔄 Restarting project: $(PROJECT_NAME)..."
	$(CMD_BASE) restart

clean:
	@echo "🧹 Cleaning project and volumes: $(PROJECT_NAME)..."
	$(CMD_BASE) down -v --remove-orphans

help:
	@echo "Penggunaan: make [target] ENV=[stg-id|prod-id|stg-v2|prod-v2]"
	@echo "Contoh: make deploy ENV=prod-id"