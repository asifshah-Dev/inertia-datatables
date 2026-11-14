'use client';

import type { CellContext } from '@tanstack/react-table';

/**
 * Default cell value formatter.
 * Handles booleans, null/undefined, objects, arrays, and other types.
 */
export function formatCellValue(value: unknown): React.ReactNode {
    if (value === null || value === undefined) {
        return '—';
    }

    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    if (typeof value === 'object') {
        try {
            const json = JSON.stringify(value);
            // Truncate long JSON strings
            return json.length > 100 ? json.slice(0, 100) + '…' : json;
        } catch {
            return String(value);
        }
    }

    // Primitives (string, number, bigint, symbol) are valid React nodes
    return value as React.ReactNode;
}

/**
 * Default cell renderer that uses formatCellValue.
 * Can be overridden by providing a custom cell formatter in the column definition.
 */
export function defaultCellFormatter<TData>(info: CellContext<TData, unknown>): React.ReactNode {
    return formatCellValue(info.getValue());
}