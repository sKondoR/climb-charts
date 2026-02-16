import { describe, it, expect } from 'vitest';
import { getChartData, getGradeCounts, groupChartData } from './getChartData';
import type { BarData, GradeCounts } from '../../types/chart';
import type { Route } from '../../types/route';
import { mockRoutes } from '../../data/mockRoutes';

describe('getChartData', () => {
  describe('getGradeCounts', () => {
    it('should count routes by grade correctly', () => {
      const routes: Route[] = [
        { date: '2025-01-01', grade: '7a', isBoulder: false, isTopRope: false, name: 'Route 1', region: 'Test' },
        { date: '2025-01-01', grade: '7a', isBoulder: false, isTopRope: false, name: 'Route 2', region: 'Test' },
        { date: '2025-01-01', grade: '7b', isBoulder: false, isTopRope: false, name: 'Route 3', region: 'Test' },
      ];

      const result = getGradeCounts(routes);
      expect(result['7a']).toBe(2);
      expect(result['7b']).toBe(1);
      expect(result['7c']).toBeUndefined();
    });

    it('should handle empty array', () => {
      const result = getGradeCounts([]);
      expect(result).toEqual({});
    });

    it('should handle routes with plus grades', () => {
      const routes: Route[] = [
        { date: '2025-01-01', grade: '7a+', isBoulder: false, isTopRope: false, name: 'Route 1', region: 'Test' },
        { date: '2025-01-01', grade: '7a+', isBoulder: false, isTopRope: false, name: 'Route 2', region: 'Test' },
        { date: '2025-01-01', grade: '7b', isBoulder: false, isTopRope: false, name: 'Route 3', region: 'Test' },
      ];

      const result = getGradeCounts(routes);
      expect(result['7a']).toBe(2);
      expect(result['7b']).toBe(1);
    });

    it('should handle routes with slash grades', () => {
      const routes: Route[] = [
        { date: '2025-01-01', grade: '6a/6a+', isBoulder: false, isTopRope: false, name: 'Route 1', region: 'Test' },
        { date: '2025-01-01', grade: '6a/6a+', isBoulder: false, isTopRope: false, name: 'Route 2', region: 'Test' },
        { date: '2025-01-01', grade: '7c+/8a', isBoulder: false, isTopRope: false, name: 'Route 3', region: 'Test' },
      ];

      const result = getGradeCounts(routes);
      expect(result['6a']).toBe(2);
      expect(result['7c']).toBe(1);
    });

    it('should handle mixed grade formats', () => {
      const routes: Route[] = [
        { date: '2025-01-01', grade: '7a', isBoulder: false, isTopRope: false, name: 'Route 1', region: 'Test' },
        { date: '2025-01-01', grade: '7b+', isBoulder: false, isTopRope: false, name: 'Route 2', region: 'Test' },
        { date: '2025-01-01', grade: '6c', isBoulder: false, isTopRope: false, name: 'Route 3', region: 'Test' },
        { date: '2025-01-01', grade: '8a+', isBoulder: false, isTopRope: false, name: 'Route 4', region: 'Test' },
      ];

      const result = getGradeCounts(routes);
      expect(result['7a']).toBe(1);
      expect(result['7b']).toBe(1);
      expect(result['6c']).toBe(1);
      expect(result['8a']).toBe(1);
    });
  });

  describe('groupChartData', () => {
    it('should group empty grade counts correctly', () => {
      const gradeCounts: GradeCounts = {};
      const result = groupChartData(gradeCounts);
      expect(result).toEqual([]);
    });

    it('should filter out zero values', () => {
      const gradeCounts: GradeCounts = {
        '7a': 2,
        '7b': 0,
        '7c': 1,
      };
      const result = groupChartData(gradeCounts);
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { label: '7a', value: 2, color: expect.any(String) },
        { label: '7c', value: 1, color: expect.any(String) },
      ]);
    });

    it('should include all grades with positive counts', () => {
      const gradeCounts: GradeCounts = {
        '7a': 3,
        '7b': 2,
        '7c': 1,
        '7d': 0,
      };
      const result = groupChartData(gradeCounts);
      expect(result).toHaveLength(3);
      expect(result.map((item) => item.label)).toEqual(['7a', '7b', '7c']);
    });

    it('should include color for each grade', () => {
      const gradeCounts: GradeCounts = {
        '7a': 1,
        '7b': 1,
        '7c': 1,
      };
      const result = groupChartData(gradeCounts);
      result.forEach((item) => {
        expect(item.color).toBeDefined();
        expect(typeof item.color).toBe('string');
      });
    });
  });

  describe('getChartData', () => {
    it('should process mock routes data correctly', () => {
      const result = getChartData(mockRoutes);
      
      // Check that result is an array
      expect(Array.isArray(result)).toBe(true);
      
      // Check that all items have required properties
      result.forEach((item) => {
        expect(item).toHaveProperty('label');
        expect(item).toHaveProperty('value');
        expect(item).toHaveProperty('color');
        expect(typeof item.label).toBe('string');
        expect(typeof item.value).toBe('number');
        expect(typeof item.color).toBe('string');
      });

      // Check that all values are positive
      result.forEach((item) => {
        expect(item.value).toBeGreaterThan(0);
      });
    });

    it('should handle empty array', () => {
      const result = getChartData([]);
      expect(result).toEqual([]);
    });

    it('should handle single route', () => {
      const routes: Route[] = [
        { date: '2025-01-01', grade: '7a', isBoulder: false, isTopRope: false, name: 'Route 1', region: 'Test' },
      ];
      const result = getChartData(routes);
      expect(result).toHaveLength(1);
      expect(result[0].label).toBe('7a');
      expect(result[0].value).toBe(1);
    });

    it('should aggregate counts correctly', () => {
      const routes: Route[] = [
        { date: '2025-01-01', grade: '7a', isBoulder: false, isTopRope: false, name: 'Route 1', region: 'Test' },
        { date: '2025-01-01', grade: '7a', isBoulder: false, isTopRope: false, name: 'Route 2', region: 'Test' },
        { date: '2025-01-01', grade: '7a', isBoulder: false, isTopRope: false, name: 'Route 3', region: 'Test' },
        { date: '2025-01-01', grade: '7b', isBoulder: false, isTopRope: false, name: 'Route 4', region: 'Test' },
        { date: '2025-01-01', grade: '7b', isBoulder: false, isTopRope: false, name: 'Route 5', region: 'Test' },
      ];
      const result = getChartData(routes);
      
      const sevenA = result.find((item) => item.label === '7a');
      const sevenB = result.find((item) => item.label === '7b');
      
      expect(sevenA?.value).toBe(3);
      expect(sevenB?.value).toBe(2);
    });

    it('should handle all grade levels', () => {
      const routes: Route[] = [
        { date: '2025-01-01', grade: '4a', isBoulder: false, isTopRope: false, name: 'Route 1', region: 'Test' },
        { date: '2025-01-01', grade: '5a', isBoulder: false, isTopRope: false, name: 'Route 2', region: 'Test' },
        { date: '2025-01-01', grade: '6a', isBoulder: false, isTopRope: false, name: 'Route 3', region: 'Test' },
        { date: '2025-01-01', grade: '7a', isBoulder: false, isTopRope: false, name: 'Route 4', region: 'Test' },
        { date: '2025-01-01', grade: '8a', isBoulder: false, isTopRope: false, name: 'Route 5', region: 'Test' },
        { date: '2025-01-01', grade: '9a', isBoulder: false, isTopRope: false, name: 'Route 6', region: 'Test' },
      ];
      const result = getChartData(routes);
      
      expect(result).toHaveLength(6);
      expect(result.map((item) => item.label)).toEqual(['4a', '5a', '6a', '7a', '8a', '9a']);
    });

    it('should handle plus grades', () => {
      const routes: Route[] = [
        { date: '2025-01-01', grade: '7a+', isBoulder: false, isTopRope: false, name: 'Route 1', region: 'Test' },
        { date: '2025-01-01', grade: '7b+', isBoulder: false, isTopRope: false, name: 'Route 2', region: 'Test' },
        { date: '2025-01-01', grade: '8a+', isBoulder: false, isTopRope: false, name: 'Route 3', region: 'Test' },
      ];
      const result = getChartData(routes);
      
      expect(result).toHaveLength(3);
      expect(result.map((item) => item.label)).toEqual(['7a', '7b', '8a']);
    });

    it('should handle slash grades', () => {
      const routes: Route[] = [
        { date: '2025-01-01', grade: '6a/6a+', isBoulder: false, isTopRope: false, name: 'Route 1', region: 'Test' },
        { date: '2025-01-01', grade: '7c+/8a', isBoulder: false, isTopRope: false, name: 'Route 2', region: 'Test' },
      ];
      const result = getChartData(routes);
      
      expect(result).toHaveLength(2);
      expect(result.map((item) => item.label)).toEqual(['6a', '7c']);
    });
  });
});
