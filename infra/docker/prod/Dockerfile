###
# deps: install once at the monorepo root (respects shared deps)
###
FROM oven/bun:1 AS deps
WORKDIR /repo

# Copy ONLY manifests for maximal cache hits
COPY package.json ./
# workspace manifests (adjust paths if yours differ)
COPY packages/server/package.json packages/server/package.json
COPY packages/client/package.json packages/client/package.json

# Optional: if you use .npmrc/.yarnrc/etc for private registries
# COPY .npmrc ./

# Install hoisted deps at the root
RUN --mount=type=cache,target=/root/.bun bun install --frozen-lockfile


###
# server-runtime: run Express on Bun, using deps from the root
###
FROM deps AS server-build
# If you need a build step (e.g., TypeScript -> dist), do it here
COPY packages/server ./packages/server
WORKDIR /repo/packages/server
# Example builds; comment out if you run TS directly with Bun
# RUN bun build src/index.ts --outdir=dist

FROM oven/bun:1 AS server-runtime
WORKDIR /repo/packages/server
# Copy the installed root node_modules and lockfiles to keep versions aligned
COPY --from=deps /repo/node_modules /repo/node_modules
COPY --from=deps /repo/package.json /repo/
COPY --from=server-build /repo/packages/server /repo/packages/server

EXPOSE 3001
# Make sure your package.json has: "start": "bun src/index.ts" or similar
CMD ["bun", "run", "start"]


###
# packages/client-builder: build React (Vite or CRA) with Bun using root deps
###
FROM deps AS client-builder
COPY packages/client ./packages/client
WORKDIR /repo/packages/client

# If you prefer API calls via env: uncomment and pass build args in compose
# ARG VITE_API_URL
# ENV VITE_API_URL=${VITE_API_URL}

RUN bun run build
# Vite -> /repo/packages/client/dist ; CRA -> /repo/packages/cleint/build


###
# client-runtime: serve static via nginx AND proxy /api to packages/server
###
FROM nginx:1.27-alpine AS client-runtime

# Custom nginx config that proxies /api to the packages/server service
COPY infra/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built assets (change to /build if CRA)
COPY --from=client-builder /repo/packages/client/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

