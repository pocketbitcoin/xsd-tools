import type { XsRestriction, XsSchema } from '../schema/index.js';
import { SerializationError } from './error.js';

// inverse of the conversions in parser/simple-type.ts and parser/attribute.ts
export function formatWithType(value: unknown, type: string, xsSchema: XsSchema, path: string): string {
  const xsSimpleType = xsSchema.xsSimpleType.find((t) => t['@name'] === type);

  if (xsSimpleType) {
    return formatWithXsRestriction(value, xsSimpleType.xsRestriction, path);
  }

  return formatWithXsRestriction(value, { '@base': type }, path);
}

export function formatWithXsRestriction(value: unknown, xsRestriction: XsRestriction, path: string): string {
  if (value === undefined || value === null) {
    throw new SerializationError('value required', path);
  }

  const base = xsRestriction['@base'];

  if (base === 'xs:integer' || base === 'xs:nonNegativeInteger') {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      throw new SerializationError(`expected integer, got ${String(value)}`, path);
    }

    return String(value);
  }

  if (base === 'xs:decimal') {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new SerializationError(`expected decimal, got ${String(value)}`, path);
    }

    if (xsRestriction.xsFractionDigits) {
      return value.toFixed(xsRestriction.xsFractionDigits['@value']);
    }

    return String(value);
  }

  if (base === 'xs:boolean') {
    if (typeof value !== 'boolean') {
      throw new SerializationError(`expected boolean, got ${String(value)}`, path);
    }

    return value ? 'true' : 'false';
  }

  if (base === 'xs:date') {
    // parsed with new Date('YYYY-MM-DD'), which is UTC midnight
    return value instanceof Date ? value.toISOString().slice(0, 10) : String(value);
  }

  if (base === 'xs:dateTime') {
    return value instanceof Date ? value.toISOString() : String(value);
  }

  return String(value);
}
