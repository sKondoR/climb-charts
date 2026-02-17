'use client';

import React, { useEffect, useRef } from 'react';
import { ChartConfig, BarData } from '@/types';
import { ChartContainer } from '@/components/shared/ChartContainer';
import { createBarChart, ChartResult } from '@/lib/createBarChart';
import { mockRoutes } from '@/data/mockRoutes';
import { getChartData } from '@/shared/util/getChartData';

interface RouteChartProps {
  config?: ChartConfig;
}

export function RouteChart({ config }: RouteChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartResult | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create bar data with grade distribution
    const chartData: BarData[] = getChartData(mockRoutes);
    
    console.log('chartData: ', chartData);
    // Create chart
    const chart = createBarChart(chartData, 800, 600);
    chartRef.current = chart;

    // Add to container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(chart.domElement);
    }

    return () => {
      if (chartRef.current && chartRef.current.domElement && chartRef.current.domElement.parentNode) {
        chartRef.current.domElement.parentNode.removeChild(chartRef.current.domElement);
      }
    };
  }, []);

  return (
    <ChartContainer config={config}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </ChartContainer>
  );
}

