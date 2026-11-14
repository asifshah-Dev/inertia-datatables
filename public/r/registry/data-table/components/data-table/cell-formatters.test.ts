import { describe, it, expect } from 'vitest';
import { formatCellValue, defaultCellFormatter } from './cell-formatters';

describe('formatCellValue', () => {
    it('returns em dash for null', () => {
        expect(formatCellValue(null)).toBe('—');
    });

    it('returns em dash for undefined', () => {
        expect(formatCellValue(undefined)).toBe('—');
    });

    it('returns "Yes" for true', () => {
        expect(formatCellValue(true)).toBe('Yes');
    });

    it('returns "No" for false', () => {
        expect(formatCellValue(false)).toBe('No');
    });

    it('returns string as-is', () => {
        expect(formatCellValue('hello')).toBe('hello');
    });

    it('returns number as-is', () => {
        expect(formatCellValue(42)).toBe(42);
        expect(formatCellValue(3.14)).toBe(3.14);
        expect(formatCellValue(0)).toBe(0);
    });

    it('returns JSON string for plain object', () => {
        expect(formatCellValue({ a: 1 })).toBe('{"a":1}');
        expect(formatCellValue({ name: 'John', age: 30 })).toBe('{"name":"John","age":30}');
    });

    it('returns JSON string for array', () => {
        expect(formatCellValue([1, 2, 3])).toBe('[1,2,3]');
        expect(formatCellValue(['a', 'b'])).toBe('["a","b"]');
    });

    it('truncates long JSON strings', () => {
        const longObj = { data: 'x'.repeat(100) };
        const result = formatCellValue(longObj);
        expect(result).toHaveLength(101); // 100 + 1 for the ellipsis
        expect(result).toMatch(/…$/);
    });

    it('handles nested objects', () => {
        expect(formatCellValue({ a: { b: 1 } })).toBe('{"a":{"b":1}}');
    });

    it('handles empty object', () => {
        expect(formatCellValue({})).toBe('{}');
    });

    it('handles empty array', () => {
        expect(formatCellValue([])).toBe('[]');
    });

    it('returns string representation for unserializable objects', () => {
        const circular: { self?: typeof circular } = {};
        circular.self = circular;
        expect(formatCellValue(circular)).toBe('[object Object]');
    });

    it('handles Date objects', () => {
        const date = new Date('2024-01-15T10:30:00.000Z');
        expect(formatCellValue(date)).toBe('"2024-01-15T10:30:00.000Z"');
    });
});

describe('defaultCellFormatter', () => {
    it('formats cell value using formatCellValue', () => {
        const mockInfo = {
            getValue: () => true,
        } as any;

        expect(defaultCellFormatter(mockInfo)).toBe('Yes');
    });

    it('handles null value', () => {
        const mockInfo = {
            getValue: () => null,
        } as any;

        expect(defaultCellFormatter(mockInfo)).toBe('—');
    });

    it('handles object value', () => {
        const mockInfo = {
            getValue: () => ({ key: 'value' }),
        } as any;

        expect(defaultCellFormatter(mockInfo)).toBe('{"key":"value"}');
    });

    it('handles array value', () => {
        const mockInfo = {
            getValue: () => [1, 2, 3],
        } as any;

        expect(defaultCellFormatter(mockInfo)).toBe('[1,2,3]');
    });
});