# Closho Admin Panel

The official admin dashboard for the Closho e-commerce platform. Built with React, Vite, Tailwind CSS (shadcn/ui), and Zustand.

## Features
- **Pure Dark Theme**: Optimized UI with gold accents.
- **Role-based Access Control (RBAC)**: Supports `SUPER_ADMIN` and `STORE_ADMIN`.
- **Multi-store Management**: Dedicated stores handling and stock management per branch.
- **Product & Inventory**: Deep nested variant system for sizes and colors.
- **Order Fulfillment**: Track and manage order lifecycles.
- **Shoppable Reels**: Upload video content and tag products.

## Tech Stack
- React 19 + Vite + TypeScript
- Tailwind CSS v4 + shadcn/ui
- TanStack Query (React Query)
- Zustand (Client State)
- React Hook Form + Zod
- Recharts (Analytics)
- React Router DOM v7

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development
Currently, the app relies on internal mock data and simulated API delays in the components. To integrate with the backend, refer to the `API_CONTRACT.md` and replace the mock function calls in `src/features/` with actual Axios calls via `react-query`.

## Build for Production
```bash
npm run build
```
