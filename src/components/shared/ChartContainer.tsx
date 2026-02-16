'use client';

import React from 'react';
import { ChartConfig } from '@/types';

interface ChartContainerProps {
  children: React.ReactNode;
  config?: ChartConfig;
}

export function ChartContainer({ children, config }: ChartContainerProps) {
  const { height = 600, width = 800, title, theme = 'dark' } = config || {};

  return (
    <div className="chart-container" style={{ width, height }}>
      {title && (
        <h2 className="chart-title" style={{ color: theme === 'dark' ? '#fff' : '#333' }}>
          {title}
        </h2>
      )}
      <div className="chart-content">{children}</div>
    </div>
  );
}
