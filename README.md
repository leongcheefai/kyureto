# MenuReady

A full-stack application with a React frontend and NestJS backend.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Code Quality](#code-quality)
- [Technology Stack](#technology-stack)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.x or higher (tested with v20.18.0)
- **npm**: v8.x or higher (tested with v11.6.0)

Check your versions:
```bash
node --version
npm --version
```

## Project Structure

This is a monorepo containing two independent applications:

```
menuready/
├── apps/
│   ├── frontend/          # React + Vite application
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── backend/           # NestJS application
│       ├── src/
│       ├── test/
│       ├── package.json
│       └── nest-cli.json
├── CLAUDE.md              # AI assistant guidance
└── README.md              # This file
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd menuready
```

### 2. Install Dependencies

Each application has its own dependencies and must be set up separately.

#### Frontend Setup

```bash
cd apps/frontend
npm install
```

#### Backend Setup

```bash
cd apps/backend
npm install
```

### 3. Start Development Servers

You'll need to run both applications in separate terminal windows/tabs.

#### Terminal 1: Start Backend

```bash
cd apps/backend
npm run start:dev
```

The backend server will start on http://localhost:3000 with hot-reload enabled.

#### Terminal 2: Start Frontend

```bash
cd apps/frontend
npm run dev
```

The frontend development server will start on http://localhost:5173 (default Vite port) with HMR (Hot Module Replacement).

## Development

### Frontend Development

**Location**: `apps/frontend`

#### Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

#### Tech Stack
- **React 19.2.0** - UI framework
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.2** - Build tool and dev server
- **ESLint 9** - Code linting with flat config

#### Key Files
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Root component
- `vite.config.ts` - Vite configuration
- `eslint.config.js` - ESLint flat configuration
- `tsconfig.json` - TypeScript project references
- `tsconfig.app.json` - App-specific TypeScript config
- `tsconfig.node.json` - Vite config TypeScript settings

### Backend Development

**Location**: `apps/backend`

#### Available Scripts

```bash
# Start development server with watch mode
npm run start:dev

# Start development server with debug mode
npm run start:debug

# Build the application
npm run build

# Start production server (requires build first)
npm run start:prod

# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:cov

# Run end-to-end tests
npm run test:e2e

# Debug tests
npm run test:debug

# Lint and auto-fix
npm run lint

# Format code with Prettier
npm run format
```

#### Tech Stack
- **NestJS 9.0.0** - Progressive Node.js framework
- **TypeScript 4.7.4** - Type safety
- **Express** - HTTP server (via NestJS)
- **Jest** - Testing framework
- **RxJS** - Reactive programming

#### Key Files
- `src/main.ts` - Application bootstrap (port 3000)
- `src/app.module.ts` - Root module
- `src/app.controller.ts` - Example controller
- `src/app.service.ts` - Example service
- `nest-cli.json` - NestJS CLI configuration
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier configuration

#### NestJS Architecture

The backend follows NestJS's modular architecture:

1. **Modules** - Organize related features
2. **Controllers** - Handle HTTP requests and routing
3. **Services** - Contain business logic
4. **Providers** - Injectable dependencies

Example of creating a new feature:

```bash
cd apps/backend

# Generate a new module
npx nest generate module users

# Generate a controller
npx nest generate controller users

# Generate a service
npx nest generate service users
```

## Testing

### Frontend Testing

Currently, no test framework is configured for the frontend. To add testing:

**Option 1: Vitest (recommended for Vite projects)**
```bash
cd apps/frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Option 2: Jest**
```bash
cd apps/frontend
npm install -D jest @testing-library/react @testing-library/jest-dom
```

### Backend Testing

The backend uses Jest for testing.

#### Unit Tests

```bash
cd apps/backend
npm run test
```

Unit test files are located alongside source files with the `.spec.ts` extension.

#### End-to-End Tests

```bash
cd apps/backend
npm run test:e2e
```

E2E tests are located in the `test/` directory with the `.e2e-spec.ts` extension.

#### Test Coverage

```bash
cd apps/backend
npm run test:cov
```

Coverage reports are generated in the `coverage/` directory.

## Building for Production

### Frontend Production Build

```bash
cd apps/frontend

# Build the application
npm run build

# Preview the production build locally
npm run preview
```

The production build will be output to `apps/frontend/dist/`.

### Backend Production Build

```bash
cd apps/backend

# Build the application
npm run build

# Start the production server
npm run start:prod
```

The compiled JavaScript will be output to `apps/backend/dist/`.

## Code Quality

### Frontend Linting

```bash
cd apps/frontend
npm run lint
```

Configuration: `eslint.config.js` (ESLint 9 flat config)

### Backend Linting and Formatting

```bash
cd apps/backend

# Lint and auto-fix
npm run lint

# Format code
npm run format
```

Configurations:
- ESLint: `.eslintrc.js`
- Prettier: `.prettierrc` (single quotes, trailing commas)

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| TypeScript | 5.9.3 | Type Safety |
| Vite | 7.2.2 | Build Tool & Dev Server |
| ESLint | 9.39.1 | Linting |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | 9.0.0 | Backend Framework |
| TypeScript | 4.7.4 | Type Safety |
| Express | 4.17.x | HTTP Server |
| Jest | 29.3.1 | Testing |
| RxJS | 7.2.0 | Reactive Programming |

## Troubleshooting

### Port Already in Use

**Frontend (port 5173)**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or specify a different port
npm run dev -- --port 5174
```

**Backend (port 3000)**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

Then edit `apps/backend/src/main.ts` to change the port if needed.

### Node Version Issues

If you encounter issues, ensure you're using Node.js v18 or higher:

```bash
node --version
```

Consider using [nvm](https://github.com/nvm-sh/nvm) to manage Node versions:

```bash
nvm install 20
nvm use 20
```

### Module Not Found

If you see "module not found" errors:

```bash
# Remove node_modules and reinstall
cd apps/frontend  # or apps/backend
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

**Frontend**: Ensure you're using TypeScript 5.9.3
```bash
cd apps/frontend
npm list typescript
```

**Backend**: Ensure you're using TypeScript 4.7.4
```bash
cd apps/backend
npm list typescript
```

### Build Errors

**Frontend**: Clear Vite cache
```bash
cd apps/frontend
rm -rf node_modules/.vite
npm run build
```

**Backend**: Clean build directory
```bash
cd apps/backend
rm -rf dist
npm run build
```

## Environment Variables

Currently, no environment variables are configured. To add them:

**Frontend** - Create `apps/frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
```

Access in code: `import.meta.env.VITE_API_URL`

**Backend** - Create `apps/backend/.env`:
```env
PORT=3000
NODE_ENV=development
```

Install dotenv: `npm install @nestjs/config`

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run linting and tests
4. Submit a pull request

### Code Style

- **Frontend**: Follow ESLint rules defined in `eslint.config.js`
- **Backend**: Follow ESLint + Prettier rules (`.eslintrc.js` + `.prettierrc`)
- Use meaningful variable and function names
- Write comments for complex logic
- Keep components and services focused and small

## License

[Add your license here]

## Support

For issues and questions, please open an issue in the repository.
