# Contributing to VELOUR

Thank you for your interest in contributing! Please read these guidelines before submitting any changes.

## ⚠️ Important: License Notice

This project is **source-available but NOT open-source**. By contributing, you agree that:

1. Your contributions become subject to the project's [Proprietary License](./LICENSE).
2. You grant the Owner (Hardik Kanajariya) a perpetual, royalty-free license to use, modify, and distribute your contribution.
3. You confirm that your contribution is your original work and does not violate any third-party rights.

## How to Contribute

### Reporting Bugs

1. Check existing [issues](../../issues) to avoid duplicates.
2. Open a new issue with:
   - Clear title describing the bug
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots (if applicable)
   - Browser/OS/Node.js version

### Suggesting Features

1. Open an issue with the **Feature Request** label.
2. Describe the feature, its use case, and proposed implementation.

### Submitting Code

1. **Fork** the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Follow the coding standards below.
4. Commit with clear messages: `feat: add product zoom on hover`
5. Push and open a **Pull Request** against the `main` branch.
6. Fill in the PR template completely.

## Coding Standards

### General

- Use **TypeScript** — no `any` types unless absolutely necessary.
- Use **functional components** and React hooks.
- Follow the existing project structure and naming conventions.

### File Naming

- Components: `kebab-case.tsx` (e.g., `product-card.tsx`)
- Utilities: `kebab-case.ts` (e.g., `format-price.ts`)
- Types: `kebab-case.ts` in `src/types/`
- API routes: `route.ts` inside the appropriate `app/api/` folder

### Code Style

- Run `npm run lint` before committing.
- Run `npm run format` to apply Prettier formatting.
- Use named exports over default exports for utilities and components.
- Keep components focused — one component per file.

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add product image zoom
fix: correct cart total calculation
docs: update API documentation
style: format footer component
refactor: extract price formatter utility
test: add unit tests for coupon validation
chore: update dependencies
```

### Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR.
- Include screenshots for UI changes.
- Update documentation if the change affects public APIs.
- Ensure no lint errors or TypeScript errors.
- Do not include environment files or secrets.

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/velour.git
cd velour

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Generate Prisma client
npx prisma generate

# Seed the database
npm run seed

# Start development server
npm run dev
```

## Code of Conduct

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before participating.

## Questions?

Contact the maintainer:

**Hardik Kanajariya**
- Email: hardik@hardikkanajariya.in
- Web: https://www.hardikkanajariya.in
