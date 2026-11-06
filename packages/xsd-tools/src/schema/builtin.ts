import type { XsRestriction, XsSchema } from './types.js';

// how a value of a built-in xs:* type is represented in javascript
export type BuiltinKind = 'string' | 'integer' | 'decimal' | 'boolean' | 'date' | 'dateTime';

// the value space of built-in types, as defined by the xsd spec
const builtinTypes: Record<string, ResolvedType> = {
  'xs:integer': { kind: 'integer' },
  'xs:nonNegativeInteger': { kind: 'integer', minInclusive: 0 },
  'xs:positiveInteger': { kind: 'integer', minInclusive: 1 },
  'xs:nonPositiveInteger': { kind: 'integer', maxInclusive: 0 },
  'xs:negativeInteger': { kind: 'integer', maxInclusive: -1 },
  'xs:long': { kind: 'integer', minInclusive: -(2 ** 63), maxInclusive: 2 ** 63 - 1 },
  'xs:int': { kind: 'integer', minInclusive: -2147483648, maxInclusive: 2147483647 },
  'xs:short': { kind: 'integer', minInclusive: -32768, maxInclusive: 32767 },
  'xs:byte': { kind: 'integer', minInclusive: -128, maxInclusive: 127 },
  'xs:unsignedLong': { kind: 'integer', minInclusive: 0, maxInclusive: 2 ** 64 - 1 },
  'xs:unsignedInt': { kind: 'integer', minInclusive: 0, maxInclusive: 4294967295 },
  'xs:unsignedShort': { kind: 'integer', minInclusive: 0, maxInclusive: 65535 },
  'xs:unsignedByte': { kind: 'integer', minInclusive: 0, maxInclusive: 255 },
  'xs:decimal': { kind: 'decimal' },
  'xs:float': { kind: 'decimal' },
  'xs:double': { kind: 'decimal' },
  'xs:boolean': { kind: 'boolean' },
  'xs:date': { kind: 'date' },
  'xs:dateTime': { kind: 'dateTime' },
  'xs:language': { kind: 'string', patterns: ['[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*'] },
};

// every other type, built-in (xs:token, xs:anyURI, ...) or unknown, is kept as a string
export function builtinType(type: string): ResolvedType {
  return builtinTypes[type] ?? { kind: 'string' };
}

export function builtinKind(type: string): BuiltinKind {
  return builtinType(type).kind;
}

export type ResolvedType = {
  kind: BuiltinKind,
  enumeration?: string[],
  patterns?: string[],
  minLength?: number,
  maxLength?: number,
  totalDigits?: number,
  fractionDigits?: number,
  minInclusive?: number,
  maxInclusive?: number,
};

// follows named simple types down to their built-in base
export function resolveType(type: string, xsSchema: XsSchema, seen = new Set<string>()): ResolvedType {
  const xsSimpleType = xsSchema.xsSimpleType.find((t) => t['@name'] === type);

  if (!xsSimpleType) {
    return builtinType(type);
  }

  if (seen.has(type)) {
    throw new Error(`simple type ${type} is derived from itself`);
  }

  seen.add(type);

  return resolveRestriction(xsSimpleType.xsRestriction, xsSchema, seen);
}

// facets are inherited from the base type, patterns of every derivation step apply and ranges only narrow
export function resolveRestriction(xsRestriction: XsRestriction, xsSchema: XsSchema, seen = new Set<string>()): ResolvedType {
  const resolved = { ...resolveType(xsRestriction['@base'], xsSchema, seen) };

  if (xsRestriction.xsEnumeration && xsRestriction.xsEnumeration.length > 0) {
    resolved.enumeration = xsRestriction.xsEnumeration.map((xsEnumeration) => xsEnumeration['@value']);
  }

  if (xsRestriction.xsPattern) {
    resolved.patterns = [...resolved.patterns ?? [], xsRestriction.xsPattern['@value']];
  }

  if (xsRestriction.xsMinLength) {
    resolved.minLength = xsRestriction.xsMinLength['@value'];
  }

  if (xsRestriction.xsMaxLength) {
    resolved.maxLength = xsRestriction.xsMaxLength['@value'];
  }

  if (xsRestriction.xsTotalDigits) {
    resolved.totalDigits = xsRestriction.xsTotalDigits['@value'];
  }

  if (xsRestriction.xsFractionDigits) {
    resolved.fractionDigits = xsRestriction.xsFractionDigits['@value'];
  }

  if (xsRestriction.xsMinInclusive) {
    resolved.minInclusive = Math.max(xsRestriction.xsMinInclusive['@value'], resolved.minInclusive ?? -Infinity);
  }

  if (xsRestriction.xsMaxInclusive) {
    resolved.maxInclusive = Math.min(xsRestriction.xsMaxInclusive['@value'], resolved.maxInclusive ?? Infinity);
  }

  return resolved;
}
