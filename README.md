# Chatbot app

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#)

This implements a chatbot for an imaginary theme park, built as a Bun monorepo with a React/Vite frontend and an Express backend. The chatbot provides answers based on information stored in a Markdown file, and the system is fully containerized for production deployment and development also. This project comes from Mosh Hamedani's AI project

## Overview

- Frontend: React application built with Vite, served via Nginx in production.
- Backend: Express API running on Bun, TypeScript compiled to JavaScript.
- Dockerized: Single multi-stage Dockerfile per application.
- Proxy & SPA Routing: Nginx serves the frontend and forwards /api requests to the backend.

---

## Development Workflow

### Starting Development Containers

```
docker compose -f docker-compose-DEV.yml up --build
```

Key Features:

- Backend runs in watch mode (bun --watch index.ts) for hot-reload.
- Frontend runs Vite dev server (bun run dev) for fast HMR.
- Host directories are mounted as volumes.
- Logs are streamed.

### Accessing the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/\*

### Stopping Development

```
docker compose -f docker-compose-DEV.yml down
```

---

## Production Workflow

### Building and Running Containers

```
docker compose -f docker-compose-PROD.yml up --build -d
```

Key Features:

- Frontend compiled and optimized via Vite, served by Nginx.
- Backend compiled from TypeScript to JavaScript, run with Bun in production mode.
- Nginx handles SPA routing and proxies /api requests to the backend.
- Minimal production images, excluding development dependencies.

### Accessing Production

- Frontend: http://localhost:5173
- API: http://localhost:5173/api/\* (proxied through Nginx)

---
