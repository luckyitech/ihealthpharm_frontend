# IHealthPharm Frontend

Angular NextGen Frontend Application for IHealthPharm - A comprehensive pharmaceutical management system.

## Project Structure

```
frontend/              # Angular NextGen Frontend Application
├── src/              # Source code
│   ├── app/          # Application components and modules
│   ├── assets/       # Static assets (images, etc.)
│   ├── environments/ # Environment configuration
│   └── index.html    # Main HTML file
├── e2e/              # End-to-end tests
├── angular.json      # Angular CLI configuration
├── package.json      # Project dependencies
├── tsconfig.json     # TypeScript configuration
└── karma.conf.js     # Test runner configuration
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (optional, but recommended)

## Installation

```bash
cd frontend
npm install
```

## Development

Start the development server:

```bash
cd frontend
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Build the project for production:

```bash
cd frontend
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

## Running Tests

### Unit Tests

```bash
cd frontend
ng test
```

### End-to-End Tests

```bash
cd frontend
ng e2e
```

## Linting

```bash
cd frontend
ng lint
```

## Features

- User authentication and authorization
- Dashboard with charts and analytics
- Inventory management
- Finance and accounting
- Sales management
- Reports and analytics
- Stock management
- Master data management

## Environment Configuration

Configure your API endpoints in:
- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)

## License

All rights reserved.
