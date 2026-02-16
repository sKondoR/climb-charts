import { describe, it, expect } from 'vitest';
import { getGradeKey } from './getGradeKey';
import type { Grade } from '../../types';

describe('getGradeKey', () => {
  describe('basic grades without plus', () => {
    it('should return grade without plus for 7a', () => {
      expect(getGradeKey('7a' as Grade)).toBe('7a');
    });

    it('should return grade without plus for 6a+', () => {
      expect(getGradeKey('6a+' as Grade)).toBe('6a+');
    });

    it('should return grade without plus for 6a/6a+', () => {
      expect(getGradeKey('6a/6a+' as Grade)).toBe('6a');
    });

    it('should return grade without plus for 7c+/8a', () => {
      expect(getGradeKey('7c+/8a' as Grade)).toBe('7c+');
    });
  });

  describe('edge cases', () => {
    it('should strip plus sign from all grade variations', () => {
      const grades: Grade[] = [
        '4a', '4a+', '4b', '4b+', '4c', '4c+',
        '5a', '5a+', '5b', '5b+', '5c', '5c+',
        '6a', '6a+', '6b', '6b+', '6c', '6c+',
        '7a', '7a+', '7b', '7b+', '7c', '7c+',
        '8a', '8a+', '8b', '8b+', '8c', '8c+',
        '9a', '9a+', '9b', '9b+', '9c', '9c+',
      ];

      grades.forEach((grade) => {
        expect(getGradeKey(grade)).toBe(grade.split('/')[0]);
      });
    });
  });
});
