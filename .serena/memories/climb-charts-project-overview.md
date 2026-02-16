# Climb Charts Project Overview

## Project Description
Micro-frontend built with Module Federation that visualizes climbing route data using Three.js 3D charts.

## Tech Stack
- **Framework**: Next.js 14.2.5 (Node.js)
- **3D Graphics**: Three.js 0.166.1
- **React 3D**: @react-three/fiber 8.16.8, @react-three/drei 9.105.6
- **Module Federation**: Webpack 5
- **TypeScript**: 5.x
- **Deployment**: Vercel

## Architecture

### Project Structure
```
climb-charts/
├── src/
│   ├── components/
│   │   ├── charts/          # 3D chart components
│   │   │   └── RouteChart.tsx
│   │   └── shared/          # Common components
│   │       └── ChartContainer.tsx
│   ├── lib/
│   │   └── three/           # Three.js utilities
│   │       ├── ThreeScene.ts
│   │       └── createBarChart.ts
│   ├── types/               # TypeScript definitions
│   │   ├── index.ts
│   │   ├── route.ts
│   │   └── chart.ts
│   ├── data/                # Mock data
│   │   └── mockRoutes.ts
│   └── app/                 # Next.js app directory
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
├── next.config.js
├── webpack.config.js        # Module Federation config
├── tsconfig.json
└── package.json
```

### Key Components

#### 1. Module Federation Configuration ([`webpack.config.js`](webpack.config.js:1))
- Exposes chart components as remote modules
- Shared dependencies: React, Three.js, @react-three/fiber, @react-three/drei
- Singleton sharing for consistent versions

#### 2. Three.js Integration
- [`ThreeScene.ts`](src/lib/three/ThreeScene.ts:1) - Base 3D scene setup
- [`createBarChart.ts`](src/lib/three/createBarChart.ts:1) - Dynamic bar chart generation
- Uses MeshStandardMaterial for realistic lighting
- Canvas-based text labels for chart labels

#### 3. Chart Components
- [`RouteChart.tsx`](src/components/charts/RouteChart.tsx:1) - Main route visualization
- [`ChartContainer.tsx`](src/components/shared/ChartContainer.tsx:1) - Reusable container

#### 4. Type System
- [`Route`](src/types/route.ts:3) - Route data model
- [`ChartConfig`](src/types/chart.ts:3) - Chart configuration
- [`GradeSystem`](src/types/route.ts:23) - Climbing grade definitions

## Data Model

### Route Interface
```typescript
{
  id: string;
  name: string;
  grade: string;
  category: string;
  attempts: number;
  success: boolean;
  date: string;
  location?: string;
  difficulty?: number;
  height?: number;
}
```

## Deployment
- Built for Vercel deployment
- Uses Next.js SSR/SSG capabilities
- Optimized for performance with lazy loading

## Future Enhancements
- Additional chart types (line, scatter)
- Interactive 3D navigation
- Real-time data updates
- Multiple grade systems support
- Export functionality