import type { XsRestriction, XsSchema } from './types.js';

// how a value of a built-in xs:* type is represented in javascript
export type BuiltinKind = 'string' | 'integer' | 'decimal' | 'boolean' | 'date' | 'dateTime';

const builtinKinds: Record<string, BuiltinKind> = {
  'xs:integer': 'integer',
  'xs:nonNegativeInteger': 'integer',
  'xs:positiveInteger': 'integer',
  'xs:nonPositiveInteger': 'integer',
  'xs:negativeInteger': 'integer',
  'xs:long': 'integer',
  'xs:int': 'integer',
  'xs:short': 'integer',
  'xs:byte': 'integer',
  'xs:unsignedLong': 'integer',
  'xs:unsignedInt': 'integer',
  'xs:unsignedShort': 'integer',
  'xs:unsignedByte': 'integer',
  'xs:decimal': 'decimal',
  'xs:float': 'decimal',
  'xs:double': 'decimal',
  'xs:boolean': 'boolean',
  'xs:date': 'date',
  'xs:dateTime': 'dateTime',
};

// every other type, built-in (xs:token, xs:anyURI, ...) or unknown, is kept as a string
export function builtinKind(type: string): BuiltinKind {
  return builtinKinds[type] ?? 'string';
}

export type ResolvedType = {
  kind: BuiltinKind,
  fractionDigits?: number,
};

// follows named simple types down to their built-in base
export function resolveType(type: string, xsSchema: XsSchema, seen = new Set<string>()): ResolvedType {
  const xsSimpleType = xsSchema.xsSimpleType.find((t) => t['@name'] === type);

  if (!xsSimpleType) {
    return { kind: builtinKind(type) };
  }

  if (seen.has(type)) {
    throw new Error(`simple type ${type} is derived from itself`);
  }

  seen.add(type);

  return resolveRestriction(xsSimpleType.xsRestriction, xsSchema, seen);
}

export function resolveRestriction(xsRestriction: XsRestriction, xsSchema: XsSchema, seen = new Set<string>()): ResolvedType {
  const resolved = resolveType(xsRestriction['@base'], xsSchema, seen);
  const fractionDigits = xsRestriction.xsFractionDigits?.['@value'] ?? resolved.fractionDigits;

  return fractionDigits === undefined ? resolved : { ...resolved, fractionDigits };
}
