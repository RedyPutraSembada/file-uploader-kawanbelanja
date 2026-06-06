# --- Tahap 1: Base ---
FROM oven/bun:1.3.5-alpine AS base
WORKDIR /app

# --- Tahap 2: Dependencies ---
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# --- Tahap 3: Runner ---
FROM oven/bun:1.3.5-alpine AS runner
WORKDIR /app

# Copy file env sesuai ARG
ARG ENV_FILE=.env
# Copy source code
COPY . .

# Buat folder public jika belum ada
RUN mkdir -p public

# Copy env file dari build context langsung
COPY ${ENV_FILE} .env

EXPOSE 4001

CMD ["bun", "server.js"]
