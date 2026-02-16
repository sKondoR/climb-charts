'use client';

import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ChartConfig, BarData } from '@/types';
import { ChartContainer } from '@/components/shared/ChartContainer';
import { createBarChart, ChartResult } from '@/lib/three/createBarChart';
import { mockRoutes } from '@/data/mockRoutes';
import { GRADES_COLORS, DIFFICULTY } from '@/types/route';

interface RouteChartProps {
  config?: ChartConfig;
}

export function RouteChart({ config }: RouteChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartResult | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Group routes by grade and count occurrences
    const gradeCounts: Record<string, number> = {};
    
    mockRoutes.forEach((route) => {
      const gradeKey = route.grade.split('/')[0];
      gradeCounts[gradeKey] = (gradeCounts[gradeKey] || 0) + 1;
    });

    // Create bar data with grade distribution
    const gradeDistribution: BarData[] = DIFFICULTY.map((grade: string): BarData => {
      const count = gradeCounts[grade] || 0;
      return {
        label: grade,
        value: count,
        color: GRADES_COLORS[grade] || '#4ade80',
      };
    }).filter((item: BarData): boolean => item.value > 0); // Only include grades with routes

    console.log('gradeDistribution', gradeDistribution);
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

