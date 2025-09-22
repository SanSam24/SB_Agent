# Overview

This is a chat application built with React and Express.js that allows users to interact with AI agents through a conversational interface. The application features a modern UI with shadcn/ui components, supports multiple AI agents with different roles and capabilities, and provides conversation management functionality. Users can create custom agents, manage chat conversations, and interact through a responsive chat interface that works on both desktop and mobile devices.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React and TypeScript using Vite as the build tool. The application follows a component-based architecture with a clear separation of concerns:

- **UI Framework**: React with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: TanStack React Query for server state management and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Component Library**: shadcn/ui providing accessible, customizable components built on Radix UI primitives

The application uses a modular structure with components organized by feature (chat functionality) and reusable UI components. Custom hooks handle data fetching, chat logic, and theme management.

## Backend Architecture
The backend is an Express.js server with TypeScript that provides a REST API for managing agents, conversations, and messages:

- **Framework**: Express.js with TypeScript for API development
- **API Design**: RESTful endpoints for CRUD operations on agents, conversations, and messages
- **Data Layer**: Abstracted storage interface allowing for different storage implementations
- **Development Setup**: Vite integration for hot module replacement and development experience

The server implements middleware for request logging and error handling, with a clean separation between route definitions and business logic.

## Data Storage
The application uses a flexible storage architecture with both database and in-memory options:

- **Database**: PostgreSQL with Drizzle ORM for production data persistence
- **Schema**: Well-defined tables for agents, conversations, and messages with proper relationships
- **In-Memory Storage**: Local storage implementation for development and testing
- **Migration Support**: Drizzle Kit for database schema management and migrations

The storage layer is abstracted through interfaces, making it easy to switch between different storage implementations.

## Authentication and Authorization
Currently, the application does not implement authentication or authorization mechanisms. All endpoints are publicly accessible, which is suitable for development but would need to be enhanced for production use.

## Chat System
The chat functionality is built around a multi-agent conversation system:

- **Agent Management**: Users can create and manage AI agents with different roles, descriptions, and visual identities
- **Conversation Handling**: Support for multiple concurrent conversations with message persistence
- **Real-time UI**: Typing indicators and smooth message rendering with auto-scroll functionality
- **Responsive Design**: Mobile-optimized interface with collapsible sidebar and bottom navigation

The chat system supports agent switching within conversations and maintains conversation history across sessions.

# External Dependencies

## Core Technologies
- **React**: Frontend framework for building the user interface
- **Express.js**: Backend web framework for the API server
- **TypeScript**: Type system for both frontend and backend code
- **Vite**: Build tool and development server with fast HMR

## Database and ORM
- **PostgreSQL**: Primary database for data persistence
- **Drizzle ORM**: Type-safe ORM for database operations and schema management
- **@neondatabase/serverless**: PostgreSQL driver for serverless environments

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Headless UI primitives for accessible components
- **Lucide React**: Icon library for consistent iconography

## State Management and Data Fetching
- **TanStack React Query**: Server state management and data synchronization
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation and type inference

## Development and Build Tools
- **ESBuild**: Fast bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer
- **TSX**: TypeScript execution for development server

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **class-variance-authority**: Variant-based component styling
- **nanoid**: Unique ID generation
- **wouter**: Lightweight routing for React

## Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions (configured but not actively used in current implementation)