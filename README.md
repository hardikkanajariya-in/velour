<div align="center">

# VELOUR — Wear the Story

**Premium branded e-commerce platform for men, women, and kids.**

Built with Next.js 16 · React 19 · Tailwind CSS 4 · Prisma 7 · PostgreSQL

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

[Live Demo](#demo) · [Features](#features) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [License](#%EF%B8%8F-license)

</div>

---

## ⚠️ License Notice

> **This is NOT an open-source project.**
>
> This repository is **source-available for demonstration and educational purposes only**. Using this code for commercial purposes, deploying it to production, or redistributing it without prior written permission from the owner is **strictly prohibited** and constitutes a violation of copyright law.
>
> See the full [LICENSE](./LICENSE) for details. For commercial licensing inquiries, contact **hardik@hardikkanajariya.in**.

---

## About

VELOUR is a full-featured, production-grade e-commerce platform designed and developed by **[Hardik Kanajariya](https://www.hardikkanajariya.in)** — a Full Stack Developer & Digital Solutions Expert based in Gujarat, India.

This project showcases modern web development practices including server components, serverless database architecture, secure authentication, payment integration, and responsive design.

---

## Features

### 🛍️ Storefront
- Responsive product catalog with categories, brands, and filters
- Product detail pages with image gallery, variants (size/color), and reviews
- Full-text search with instant results overlay
- Wishlist and cart management with Zustand state
- Coupon system with automatic validation

### 👤 Customer
- Authentication (credentials + Google OAuth) via NextAuth v5
- Account dashboard with order history and tracking
- Address management with default selection
- Product reviews and ratings

### 🛒 Checkout & Payments
- Multi-step checkout flow
- Razorpay payment gateway integration
- Order confirmation with email notifications via Resend

### 📝 Content
- Blog system with categories and tags
- Dynamic banner management
- Size guide with measurement tables
- FAQ, About, Contact, Privacy, and Terms pages

### ⚙️ Admin Dashboard
- Product, category, and brand management
- Order management with timeline tracking
- Customer management
- Coupon and banner management
- Blog post editor
- Review moderation
- Analytics overview with stat cards

### 🔧 Developer Experience
- 100% TypeScript with strict mode
- Prisma ORM with Neon serverless PostgreSQL
- Zod validation schemas
- Custom UI component library (no external UI framework)
- Theme system with CSS custom properties
- SEO optimized with JSON-LD, sitemap, and robots.txt

---

## Tech Stack

| Layer       | Technology                                                |
| ----------- | --------------------------------------------------------- |
| Framework   | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language    | [TypeScript 5](https://www.typescriptlang.org)            |
| Styling     | [Tailwind CSS 4](https://tailwindcss.com)                 |
| Database    | [PostgreSQL](https://www.postgresql.org) via [Neon](https://neon.tech) |
| ORM         | [Prisma 7](https://www.prisma.io)                         |
| Auth        | [NextAuth v5](https://authjs.dev) (Credentials + Google)  |
| Payments    | [Razorpay](https://razorpay.com)                          |
| File Upload | [Cloudinary](https://cloudinary.com)                      |
| Email       | [Resend](https://resend.com)                              |
| State       | [Zustand](https://zustand.docs.pmnd.rs)                   |
| Validation  | [Zod 4](https://zod.dev)                                  |
| Forms       | [React Hook Form](https://react-hook-form.com)            |
| Icons       | [Lucide React](https://lucide.dev)                        |

---

## Getting Started

> **Prerequisites**: Node.js 20+, npm 10+, a PostgreSQL database (Neon recommended)

### 1. Clone & Install

```bash
git clone https://github.com/hardik-kanajariya/velour.git
cd velour
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Fill in the required environment variables:

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
AUTH_SECRET="your-secret"
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."

# Razorpay
RAZORPAY_KEY_ID="..."
RAZORPAY_KEY_SECRET="..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Resend
RESEND_API_KEY="..."

# Public
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_RAZORPAY_KEY_ID="..."
```

### 3. Setup Database

```bash
npx prisma generate
npx prisma db push
npm run seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Demo Credentials

| Role     | Email               | Password      |
| -------- | ------------------- | ------------- |
| Admin    | admin@velour.in     | Admin@123     |
| Customer | customer@test.com   | Customer@123  |

### Reset Demo Data

The app includes an open API endpoint to wipe the database and re-seed it with fresh demo data. No authentication is required — it is intended for demo/evaluation use only.

**Endpoint:** `POST /api/admin/reset-demo`

```bash
curl -X POST http://localhost:3000/api/admin/reset-demo
```

**What it does:**
1. Deletes all existing data (products, orders, users, etc.) in a single transaction
2. Re-creates demo users (admin + customer with credentials above)
3. Seeds 5 brands, 15 categories, 41 products with Unsplash images and variants
4. Adds 3 coupons, 3 banners, 12 reviews, 3 blog posts, 2 size guides, and a sample customer address

**Response:**
```json
{
  "success": true,
  "message": "Database reset and re-seeded successfully",
  "summary": {
    "products": 41,
    "brands": 5,
    "categories": 15,
    "coupons": 3,
    "banners": 3,
    "blogPosts": 3,
    "sizeGuides": 2,
    "reviews": 12
  }
}
```

> **Warning:** This endpoint permanently deletes ALL data. Do not expose it in a production environment.

---

## Project Structure

```
├── prisma/                 # Database schema & seed data
├── public/                 # Static assets
├── scripts/                # Build scripts (theme CSS generator)
├── src/
│   ├── app/
│   │   ├── (store)/        # Customer-facing pages
│   │   ├── admin/          # Admin dashboard
│   │   ├── api/            # API routes
│   │   └── auth/           # Authentication pages
│   ├── components/
│   │   ├── admin/          # Admin UI components
│   │   ├── layout/         # Header, Footer, Breadcrumb
│   │   ├── store/          # Store-specific components
│   │   └── ui/             # Reusable UI primitives
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities, configs, validations
│   ├── store/              # Zustand state stores
│   ├── styles/             # Generated theme CSS
│   └── types/              # TypeScript type definitions
├── .github/                # GitHub templates & configs
├── LICENSE                 # Proprietary license
├── CONTRIBUTING.md         # Contribution guidelines
├── CODE_OF_CONDUCT.md      # Community standards
└── SECURITY.md             # Security policy
```

---

## 📸 Screenshots

> _Coming soon — the application includes a fully responsive storefront, admin dashboard, checkout flow, and more._

---

## ⚖️ License

**Proprietary — All Rights Reserved**

Copyright © 2024–2026 [Hardik Kanajariya](https://www.hardikkanajariya.in). All rights reserved.

This software is **source-available for demo purposes only**. You may view the code and run it locally for personal evaluation, but you **may not**:

- Use the code for any **commercial purpose**
- **Deploy** it to any production or public server
- **Redistribute**, sublicense, or sell the code
- **Remove** attribution or copyright notices

For commercial licensing, contact **hardik@hardikkanajariya.in**.

See the full [LICENSE](./LICENSE) file for complete terms.

---

## 👤 Author

<table>
  <tr>
    <td>
      <strong>Hardik Kanajariya</strong><br/>
      Full Stack Developer & Digital Solutions Expert<br/><br/>
      🌐 <a href="https://www.hardikkanajariya.in">hardikkanajariya.in</a><br/>
      📧 <a href="mailto:hardik@hardikkanajariya.in">hardik@hardikkanajariya.in</a><br/>
      📱 +91 6353485415<br/><br/>
      <a href="https://github.com/hardik-kanajariya">GitHub</a> ·
      <a href="https://www.linkedin.com/in/hardik-kanajariya/">LinkedIn</a> ·
      <a href="https://x.com/hardik_web">Twitter</a> ·
      <a href="https://www.instagram.com/kanajariyahardik/">Instagram</a>
    </td>
  </tr>
</table>

---

<div align="center">

**Designed & Developed by [hardikkanajariya.in](https://www.hardikkanajariya.in)**

Made with ❤️ in India

</div>
