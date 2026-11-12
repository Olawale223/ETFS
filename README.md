# Anon Commerce Platform

Anon is a full-stack commerce platform consisting of a React website, an Expo mobile application, and a shared Express API.

## Applications

- **Website** (`apps/web`) — responsive Vite + React storefront.
- **Mobile app** (`apps/mobile`) — Expo application for iOS, Android, and web.
- **API** (`apps/api`) — Express + TypeScript backend with MongoDB/Mongoose.

The applications share design tokens, TypeScript domain models, and a typed API client from `packages/`.

## Features

- Product and category browsing
- Product details and search
- JWT authentication and registration
- Persistent cart and wishlist
- Checkout and order history
- Editorial blog posts
- Responsive Anon visual design across web and mobile

## Requirements

- Node.js 18.18 or newer
- npm
- MongoDB running locally or a MongoDB connection string

## Installation

```bash
npm install
```

Create the API environment file:

```powershell
Copy-Item apps\api\.env.example apps\api\.env
```

Update `apps/api/.env` if MongoDB is not using the default local connection.

## Seed the database

With MongoDB running:

```bash
npm run seed
```

This loads the product catalog, categories, and editorial blog posts.

## Run locally

Start the API:

```bash
npm run dev:api
```

Start the website in a second terminal:

```bash
npm run dev:web
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

Start the Expo app:

```bash
npm --workspace apps/mobile run start
```

Then press `w` for Expo Web, `a` for Android, or `i` for iOS.

## Validation

```bash
npm run typecheck
npm run build:web
npm run build --workspace @anon/api
npx tsc --noEmit -p apps\mobile\tsconfig.json
```

## Repository structure

```text
apps/
  api/       Express API and database seed
  mobile/    Expo application
  web/       React website
packages/
  api-client/
  design-tokens/
  types/
```
