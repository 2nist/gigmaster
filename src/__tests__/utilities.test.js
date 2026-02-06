/**
 * utilities.test.js - Tests for utility functions
 */

import { clampMorale, randStat, clampStat, randomFrom, buildMember, memberDisplayName } from '../utils/helpers';

describe('Utility Functions', () => {
  test('clampMorale returns value between 0-100', () => {
    expect(clampMorale(50)).toBe(50);
    expect(clampMorale(-10)).toBe(0);
    expect(clampMorale(150)).toBe(100);
  });

  test('randStat returns number in range', () => {
    const stat = randStat(2.5, 6);
    expect(stat).toBeGreaterThanOrEqual(2.5);
    expect(stat).toBeLessThanOrEqual(6);
  });

  test('clampStat returns value between 1-10', () => {
    expect(clampStat(5)).toBeGreaterThanOrEqual(1);
    expect(clampStat(5)).toBeLessThanOrEqual(10);
    expect(clampStat(0)).toBe(1);
    expect(clampStat(15)).toBe(10);
  });

  test('randomFrom selects from array', () => {
    const arr = ['a', 'b', 'c'];
    const result = randomFrom(arr);
    expect(arr).toContain(result);
  });

  test('buildMember creates member object', () => {
    const member = buildMember('vocals');
    expect(member.role).toBe('vocals');
    expect(member.id).toBeDefined();
    expect(member.stats).toBeDefined();
    expect(member.stats.skill).toBeDefined();
  });

  test('memberDisplayName returns valid string', () => {
    const member = { firstName: 'John', lastName: 'Doe', nickname: '', name: 'John Doe' };
    const result = memberDisplayName(member);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

