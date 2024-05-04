import { expect, test } from 'vitest';
import sum from './sum';

test('returns the sum of two positive numbers', () => {
  expect(sum(1, 2)).toBe(3);
});

test('returns the sum of a positive and a negative number', () => {
  expect(sum(-1, 2)).toBe(1);
});

test('returns the sum of two negative numbers', () => {
  expect(sum(-1, -2)).toBe(-3);
});

test('returns zero when adding zero and a number', () => {
  expect(sum(0, 2)).toBe(2);
});
