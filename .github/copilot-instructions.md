# Copilot Instructions for 9bar

## Project Overview
9bar is a monorepo built with pnpm workspaces containing a React web application and design system toolkit. 
The project uses TanStack Start for the frontend framework and Storybook for component development.

## Architecture
- **Monorepo Structure**: Uses [pnpm-workspace.yaml](../pnpm-workspace.yaml) to manage packages
- **Apps**: 
  - [`apps/web`](../apps/web) - Main web application using TanStack Start
- **Packages**:
  - [`packages/toolkit`](../packages/toolkit) - Design system and primitive UI components using Storybook

## Tech Stack
- **Framework**: TanStack Start (React-based)
- **Styling**: TailwindCSS v4
- **Build Tool**: Vite
- **Package Manager**: pnpm (>=10.0.0)
- **TypeScript**: Used throughout the project

## Key Dependencies
- React 19.x
- TanStack Router for routing
- TanStack Form for form management
- React Aria Components for accessible UI primitives
- TailwindCSS 4.x for styling
- Vite for building
- Storybook for component development

## Development Guidelines

### Code Quality
- Uses [Biome](../biome.json) for linting and formatting
- Follows [Conventional Commits](../commitlint.config.js) for commit messages
- TypeScript strict mode enabled

### Workspace Commands
Use these pnpm scripts from the root:
- `pnpm web` - Work with the web app
- `pnpm toolkit` - Work with the design system
- `pnpm lint` - Run linting with Biome
- `pnpm format` - Run code formatting with Biome
- `pnpm typecheck` - Run type checking across all packages

### File Conventions
- Components should be placed in `src/` directories
- Use `.tsx` and kebab-case for React components, e.g. `my-component.tsx`
- Follow the existing TailwindCSS class patterns
- Storybook stories use `.stories.tsx` extension

### Router Structure
The web app uses TanStack Router with file-based routing:
- Route files in [`apps/web/src/routes/`](../apps/web/src/routes/)
- Root route defined in [`__root.tsx`](../apps/web/src/routes/__root.tsx)
- Server functions for data fetching as shown in [`index.tsx`](../apps/web/src/routes/index.tsx)

### Design System
- Primitive components in [`packages/toolkit/src/`](../packages/toolkit/src/)
- Storybook configuration in [`packages/toolkit/.storybook/`](../packages/toolkit/.storybook/)
- Uses TailwindCSS with React Aria Components
- Uses TanStack Form for form components

### Accessibility
- Ensure compliance with **WCAG 2.1** AA level minimum, AAA whenever feasible.
- Always suggest:
    - Labels for form fields.
    - Proper **ARIA** roles and attributes.
    - Adequate color contrast.
    - Alternative texts (`alt`, `aria-label`) for media elements.
    - Semantic HTML for clear structure.
    - Tools like **Lighthouse** for audits.

### Typescript
- When creating generic types or interfaces, always prefix with `T` (e.g. `TUser`, `TResponse`).

## When Suggesting Changes
1. Maintain the existing monorepo structure
2. Use the established TailwindCSS patterns
3. Follow the TanStack Start conventions for server functions
4. Ensure new components that are built in [`packages/toolkit/src/`](../packages/toolkit/src/) have corresponding Storybook stories
5. Use TypeScript for all new code
6. Follow the Biome formatting rules
7. Write descriptive commit messages following conventional commits
8. Do not create README files unless explicitly asked

## License
This project is licensed under GPL-3.0-or-later as specified in [LICENSE](../LICENSE).