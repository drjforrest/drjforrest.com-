# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an academic profile website built with Next.js 15, featuring a personal/professional website for a modern academic to communicate research findings and engage collaborators and funders. The site is titled "Forrest Insights | Collaboration and Capacity in the Age of AI".

## Development Commands

- **Development server**: `npm run dev` (runs on port 9002)
- **Build**: `npm run build`
- **Start production**: `npm start`
- **Lint**: `npm run lint`
- **Type checking**: `npm run typecheck`
- **Genkit development**: `npm run genkit:dev` (for AI development)
- **Genkit watch mode**: `npm run genkit:watch` (for AI development with hot reload)

## Architecture

### Framework & Tech Stack
- **Next.js 15** with TypeScript and App Router
- **Tailwind CSS** for styling with shadcn/ui component library
- **Firebase** integration (via apphosting.yaml)
- **Google AI Genkit** for AI features (Gemini 2.5 Flash model)
- **Radix UI** components for accessible UI primitives
- **Lucide React** for icons

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Homepage composition
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── publications/      # Publications page
│   └── research/          # Research page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── home/              # Homepage-specific components
│   │   ├── hero.tsx
│   │   ├── at-a-glance.tsx
│   │   ├── dual-role.tsx
│   │   ├── network-viz.tsx
│   │   └── publications.tsx
│   ├── header.tsx         # Site navigation
│   ├── footer.tsx         # Site footer
│   ├── theme-provider.tsx # Dark/light theme support
│   └── contact-form.tsx   # Contact form
├── ai/                    # AI/Genkit integration
│   ├── genkit.ts          # Genkit configuration
│   ├── dev.ts             # Development server
│   └── flows/             # AI flows/workflows
├── lib/
│   ├── utils.ts           # Utility functions
│   ├── data.ts            # Data constants
│   └── constants.ts       # App constants
└── hooks/                 # Custom React hooks
```

### Key Features
- **Theme System**: Dark/light mode support via next-themes
- **Typography**: Inter (body) and Space Grotesk (headlines) fonts
- **AI Integration**: Google AI Genkit for AI-powered features
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Component Library**: shadcn/ui for consistent, accessible components

### Configuration Notes
- **TypeScript**: Strict mode enabled with build error ignoring (development convenience)
- **ESLint**: Build-time linting disabled (development convenience)
- **Imports**: `@/*` alias maps to `src/*`
- **Image Optimization**: Remote patterns configured for picsum.photos

### Development Patterns
- Components use TypeScript with proper typing
- Tailwind CSS with CSS variables for theming
- shadcn/ui component library for UI consistency
- AI features are modular and located in `src/ai/`
- Homepage is component-based for maintainability

### AI Development
- Simple AI client supporting Mistral and DeepSeek APIs in `src/lib/ai-client.ts`
- AI functions are in `src/ai/` (carousel-content.ts, homepage-visuals.ts)
- Environment variables: `AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL` (see .env.example for local development)
- Production environment already configured with API keys in Vercel
- DeepSeek is cost-effective default, Mistral also supported

When making changes, ensure compatibility with the existing shadcn/ui component system and follow the established patterns for TypeScript, Tailwind CSS, and component composition.