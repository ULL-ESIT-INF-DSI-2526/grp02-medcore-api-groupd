import { describe, test, expect } from 'vitest';
import { hello } from '../src/index'; 

describe('hello function', () => {
  test('should return a greeting with the name', () => {
    const result = hello('Vitest');
    expect(result).toBe('Hola, Vitest!');
  });
});
