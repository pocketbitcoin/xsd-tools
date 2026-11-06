import { checkFacets, resolveRestriction, resolveType, type ResolvedType, type XsRestriction, type XsSchema } from '../schema/index.js';
import { SerializationError } from './error.js';

// inverse of parseText in parser/simple-type.ts
export function formatWithType(value: unknown, type: string, xsSchema: XsSchema, path: string): string {
  return formatValue(value, resolveType(type, xsSchema), path);
}

export function formatWithXsRestriction(value: unknown, xsRestriction: XsRestriction, xsSchema: XsSchema, path: string): string {
  return formatValue(value, resolveRestriction(xsRestriction, xsSchema), path);
}

function formatValue(value: unknown, type: ResolvedType, path: string): string {
  const text = formatText(value, type, path);
  const error = checkFacets(text, type);

  if (error !== undefined) {
    throw new SerializationError(error, path);
  }

  return text;
}

// String() uses exponent notation below 1e-6 and from 1e21, which xs:decimal does not allow
function toDecimalString(value: number) {
  const [mantissa = '', exponent] = String(Math.abs(value)).split('e');

  if (exponent === undefined) {
    return String(value);
  }

  const [integer = '', fraction = ''] = mantissa.split('.');
  const digits = integer + fraction;
  const point = integer.length + Number(exponent);

  const unsigned = point <= 0
    ? `0.${'0'.repeat(-point)}${digits}`
    : point >= digits.length
      ? digits + '0'.repeat(point - digits.length)
      : `${digits.slice(0, point)}.${digits.slice(point)}`;

  return value < 0 ? `-${unsigned}` : unsigned;
}

// never rounds, so that excess fraction digits fail validation
function padFraction(text: string, fractionDigits: number) {
  const [integer, fraction = ''] = text.split('.');

  if (fraction.length >= fractionDigits) {
    return text;
  }

  return `${integer}.${fraction.padEnd(fractionDigits, '0')}`;
}

function formatText(value: unknown, { kind, fractionDigits }: ResolvedType, path: string): string {
  if (value === undefined || value === null) {
    throw new SerializationError('value required', path);
  }

  if (kind === 'integer') {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      throw new SerializationError(`expected integer, got ${String(value)}`, path);
    }

    return toDecimalString(value);
  }

  if (kind === 'decimal') {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new SerializationError(`expected decimal, got ${String(value)}`, path);
    }

    const text = toDecimalString(value);

    return fractionDigits === undefined ? text : padFraction(text, fractionDigits);
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
