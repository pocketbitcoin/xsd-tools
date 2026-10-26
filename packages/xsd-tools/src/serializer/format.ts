import { resolveRestriction, resolveType, type ResolvedType, type XsRestriction, type XsSchema } from '../schema/index.js';
import { SerializationError } from './error.js';

// inverse of parseText in parser/simple-type.ts
export function formatWithType(value: unknown, type: string, xsSchema: XsSchema, path: string): string {
  return formatValue(value, resolveType(type, xsSchema), path);
}

export function formatWithXsRestriction(value: unknown, xsRestriction: XsRestriction, xsSchema: XsSchema, path: string): string {
  return formatValue(value, resolveRestriction(xsRestriction, xsSchema), path);
}

function formatValue(value: unknown, { kind, fractionDigits }: ResolvedType, path: string): string {
  if (value === undefined || value === null) {
    throw new SerializationError('value required', path);
  }

  if (kind === 'integer') {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      throw new SerializationError(`expected integer, got ${String(value)}`, path);
    }

    return String(value);
  }

  if (kind === 'decimal') {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new SerializationError(`expected decimal, got ${String(value)}`, path);
    }

    if (fractionDigits !== undefined) {
      return value.toFixed(fractionDigits);
    }

    return String(value);
  }

  if (kind === 'boolean') {
    if (typeof value !== 'boolean') {
      throw new SerializationError(`expected boolean, got ${String(value)}`, path);
    }

    return value ? 'true' : 'false';
  }

  if (kind === 'date') {
    // parsed with new Date('YYYY-MM-DD'), which is UTC midnight
    return value instanceof Date ? value.toISOString().slice(0, 10) : String(value);
  }

  if (kind === 'dateTime') {
    return value instanceof Date ? value.toISOString() : String(value);
  }

  return String(value);
}
