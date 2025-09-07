FROM oven/bun:1-slim

WORKDIR /app

COPY package.json ./
COPY packages/server/package.json ./packages/server/
RUN bun install

COPY packages/server ./packages/server
WORKDIR /app/packages/server

EXPOSE 3000

CMD ["bun", "run", "dev"]
