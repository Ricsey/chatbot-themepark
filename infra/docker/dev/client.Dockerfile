FROM oven/bun:1-slim AS build

WORKDIR /app

COPY package.json ./
COPY packages/client/package.json ./packages/client/
RUN bun install

COPY packages/client ./packages/client
WORKDIR /app/packages/client
CMD ["bun", "run", "dev"]
