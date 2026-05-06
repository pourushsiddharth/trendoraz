# Trendoraz E-commerce Platform

A premium, high-fashion e-commerce storefront and administrative dashboard built with Next.js 15, Neon DB, and Tailwind CSS v4.

## Features

- **Premium "Heirloom" Storefront**: Minimalist off-white aesthetic with smooth scroll animations, hero carousel (Peaky Blinders & Harry Potter themes), and dynamic collection grids.
- **Dynamic New Arrivals**: Real-time product synchronization from Neon DB.
- **Admin Dashboard**: Full CRUD management for products, specialized for fashion attributes (sizes, colors, materials, fits).
- **Responsive Layout**: Optimized for both mobile and desktop with a fixed, scroll-aware navigation system.
- **Standardized Infrastructure**: Next.js App Router with Server Actions and global design tokens.

## Technology Stack

- **Frontend**: Next.js 15 (React 19), TypeScript, Tailwind CSS v4, Lucide React icons.
- **Backend/Database**: Neon DB (PostgreSQL) using `@neondatabase/serverless`.
- **Infrastructure**: Vercel-ready with edge compatibility.

## Getting Started

1.  **Clone the project**:
    ```bash
    cd trendoraz-admin
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Ensure your `.env.local` contains a valid `DATABASE_URL` from Neon.

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Access the store at `http://localhost:3000/` (or `3001` if 3000 is occupied).
    Access the admin panel at `http://localhost:3000/admin`.

## Project Structure

- `app/(store)`: Public-facing e-commerce storefront.
- `app/admin`: Administrative tools and product management.
- `app/api`: Backend endpoints for dynamic data fetching.
- `components/`: Modular UI assets (Carousel, Product Cards, Sidebar).
- `lib/`: Utility functions and database configuration.
- `public/`: High-resolution fashion and branding assets.

---
Built with pride for Trendoraz. 🎨✨
