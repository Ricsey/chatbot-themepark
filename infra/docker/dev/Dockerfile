# Base image for backend
FROM oven/bun:1 AS backend-dev
WORKDIR /repo/packages/server

# Install backend dependencies
COPY packages/server/package.json .
COPY packages/server/tsconfig.json .
RUN bun install --frozen-lockfile

# Mount source code for live changes
VOLUME ["/repo/packages/server"]

# Expose backend port
EXPOSE 3000

# Start backend in watch mode
CMD ["bun", "--watch", "run", "index.ts"]

# Base image for frontend
FROM oven/bun:1 AS frontend-dev
WORKDIR /repo/packages/client

# Install frontend dependencies
COPY packages/client/package.json .
COPY packages/client/tsconfig.json .
RUN bun install --frozen-lockfile

# Mount source code for live changes
VOLUME ["/repo/packages/client"]

# Expose frontend port (Vite default)
EXPOSE 5173

# Start Vite dev server
CMD ["bun", "run", "dev"]
