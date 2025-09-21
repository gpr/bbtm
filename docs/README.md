# Blood Bowl Tournament Management System

A comprehensive web application for managing Blood Bowl tournaments, built with React, TypeScript, and Firebase.

## Features

- **Tournament Management**: Create, edit, and manage Blood Bowl tournaments
- **Registration System**: Handle participant registrations with support for all team races
- **Authentication**: Secure user authentication with Firebase Auth
- **Real-time Updates**: Live updates for tournament and registration changes
- **Responsive Design**: Mobile-friendly interface using Mantine UI
- **Accessibility**: WCAG 2.1 compliant design with screen reader support

## Tech Stack

- **Frontend**: React 18.3+, TypeScript, Vite
- **UI Library**: Mantine v7.17.8
- **Backend**: Firebase (Auth, Firestore, Hosting)
- **Testing**: Vitest, React Testing Library, Cypress
- **Code Quality**: ESLint, Prettier, Husky
- **Documentation**: Storybook

## Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm package manager
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bbtm
   ```

2. Install dependencies:
   ```bash
   cd frontend
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Firebase configuration
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:3000`.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components
│   │   ├── routing/        # Route-related components
│   │   └── tournaments/    # Tournament-specific components
│   ├── pages/              # Page components
│   ├── services/           # Business logic and API calls
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── schemas/            # Validation schemas
│   └── config/             # Configuration files
├── tests/                  # Test files
│   ├── unit/              # Unit tests
│   ├── components/        # Component tests
│   ├── integration/       # Integration tests
│   └── e2e/              # End-to-end tests
└── docs/                   # Documentation
```

## Available Scripts

### Development
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

### Testing
- `pnpm test` - Run unit tests
- `pnpm test:ui` - Run tests with UI
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm test:e2e:open` - Open Cypress test runner

### Code Quality
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Run TypeScript type checking

### Documentation
- `pnpm storybook` - Start Storybook documentation server
- `pnpm build-storybook` - Build Storybook for production

### Analysis
- `pnpm analyze` - Analyze bundle size
- `pnpm size` - Check build size

## Firebase Setup

1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Authentication and Firestore Database
3. Configure authentication providers (Email/Password)
4. Set up Firestore security rules (see `firestore.rules`)
5. Add your Firebase configuration to `.env.local`

## Deployment

### Render.com (Recommended)

1. Connect your repository to Render
2. Use the provided `render.yaml` configuration
3. Set environment variables in Render dashboard
4. Deploy automatically on push to main branch

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Run the test suite: `pnpm test`
5. Commit your changes: `git commit -m 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

## Code Style

This project follows strict coding standards:

- **TypeScript**: Strict mode enabled, no `any` types
- **React**: Functional components with hooks
- **Testing**: TDD approach with comprehensive test coverage
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized builds with code splitting

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Check the documentation in the `docs/` directory
- Review existing issues on GitHub
- Create a new issue for bug reports or feature requests

## Acknowledgments

- Blood Bowl is a trademark of Games Workshop Limited
- Built with React, Firebase, and Mantine UI
- Icons provided by Tabler Icons