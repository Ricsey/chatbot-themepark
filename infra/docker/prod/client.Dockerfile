FROM oven/bun:1-slim AS build

WORKDIR /app

COPY package.json ./
COPY packages/client/package.json ./packages/client/
RUN bun install

COPY packages/client ./packages/client
WORKDIR /app/packages/client
RUN bun run build

# --- Serve stage ---
FROM nginx:alpine

# Copy built React files to nginx html directory
COPY --from=build /app/packages/client/dist /usr/share/nginx/html
COPY packages/client/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
