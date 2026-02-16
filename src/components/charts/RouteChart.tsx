'use client';

import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ChartConfig, BarData } from '@/types';
import { ChartContainer } from '@/components/shared/ChartContainer';
import { createBarChart, ChartResult } from '@/lib/three/createBarChart';
import { mockRoutes } from '@/data/mockRoutes';
import { GRADES_COLORS } from '@/types/route';

interface RouteChartProps {
  config?: ChartConfig;
}

export function RouteChart({ config }: RouteChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartResult | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Extract grade distribution data
    const gradeDistribution: BarData[] = mockRoutes.map((route) => {
      // Find color based on grade prefix (strip '+' for matching)
      const gradeKey = route.grade.split('/')[0];
      const color = GRADES_COLORS[gradeKey] || '#4ade80';
      console.log('> ', route.grade, gradeKey, color);
      return {
        label: route.grade,
        value: route.attempts || 1,
        color,
      };
    });

    // Create chart
    const chart = createBarChart(gradeDistribution, 800, 600);
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

