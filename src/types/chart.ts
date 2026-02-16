// Chart-specific types

import type { Route } from './route';

export interface GradeDistribution {
  grade: string;
  count: number;
  percentage: number;
}

export interface ProgressData {
  date: string;
  totalRoutes: number;
  completedRoutes: number;
  successRate: number;
}

export interface ChartConfig {
  title?: string;
  height?: number;
  width?: number;
  theme?: 'light' | 'dark';
  animationDuration?: number;
}

export interface ChartData {
  routes?: Route[];
  gradeDistribution?: GradeDistribution[];
  progressData?: ProgressData[];
}

export interface ChartProps {
  data: ChartData;
  config?: ChartConfig;
  onRouteClick?: (route: Route) => void;
}

export interface BarChartConfig extends ChartConfig {
  type: 'bar';
  xAxisKey: string;
  yAxisKey: string;
  colorKey?: string;
}

export interface LineChartConfig extends ChartConfig {
  type: 'line';
  xKey: string;
  yKey: string;
  showPoints?: boolean;
}

export interface ScatterChartConfig extends ChartConfig {
  type: 'scatter';
  xKey: string;
  yKey: string;
  sizeKey?: string;
}

export interface BarData {
  label: string;
  value: number;
  color: string;
}
