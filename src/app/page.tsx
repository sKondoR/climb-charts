'use client';

import { RouteChart } from '@/components/charts/RouteChart';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', padding: '40px' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' }}>
        Climbing Route Charts
      </h1>
      <div style={{ display: 'grid', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <RouteChart
          config={{
            title: 'Route Attempts by Grade',
            height: 600,
            width: 800,
            theme: 'dark',
          }}
        />
      </div>
    </main>
  );
}
