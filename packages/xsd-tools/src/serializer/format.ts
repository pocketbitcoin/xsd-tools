import { checkFacets, resolveRestriction, resolveType, splitTimezone, type ResolvedType, type XsRestriction, type XsSchema } from '../schema/index.js';
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

function formatTemporal(value: unknown, kind: 'date' | 'time' | 'dateTime', path: string) {
  const { [kind]: local, tz } = typeof value === 'object' ? value as Record<string, unknown> : {};

  if (typeof local !== 'string' || (tz !== undefined && typeof tz !== 'string')) {
    throw new SerializationError(`expected { ${kind}: string, tz?: string }, got ${JSON.stringify(value)}`, path);
  }

  // a timezone belongs in tz, not at the end of the local part
  if (splitTimezone(local).tz !== undefined) {
    throw new SerializationError(`expected ${kind} without timezone, got ${local}`, path);
  }

  return local + (tz ?? '');
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

  if (kind === 'float') {
    if (typeof value !== 'number') {
      throw new SerializationError(`expected number, got ${String(value)}`, path);
    }

    if (Number.isNaN(value)) {
      return 'NaN';
    }

    if (!Number.isFinite(value)) {
      return value > 0 ? 'INF' : '-INF';
    }

    return toDecimalString(value);
  }

  if (kind === 'boolean') {
    if (typeof value !== 'boolean') {
      throw new SerializationError(`expected boolean, got ${String(value)}`, path);
    }

    return value ? 'true' : 'false';
  }

  // the inverse of the parser's { [kind], tz? }, checkFacets validates the joined text
  if (kind === 'date' || kind === 'time' || kind === 'dateTime') {
    return formatTemporal(value, kind, path);
  }

  return String(value);
}
