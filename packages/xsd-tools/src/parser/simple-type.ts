import { resolveRestriction, resolveType, type BuiltinKind, type XsSchema, type XsSimpleType } from '../schema/index.js';
import type { XMLDomElement } from '../dom.js';
import { ValidationError } from './error.js';

export function parseWithXsSimpleType(element: XMLDomElement, xsSimpleType: XsSimpleType, xsSchema: XsSchema) {
  if (!element) {
    throw new ValidationError('element required', element);
  }

  if (!element.textContent) throw new ValidationError('was empty', element);

  return parseText(element.textContent, resolveRestriction(xsSimpleType.xsRestriction, xsSchema).kind);
}

// for named simple types as well as built-in types such as xs:string
export function parseWithType(element: XMLDomElement, type: string, xsSchema: XsSchema) {
  if (!element.textContent) throw new ValidationError('was empty', element);

  return parseText(element.textContent, resolveType(type, xsSchema).kind);
}

// inverse of formatWithType in serializer/format.ts
export function parseText(text: string, kind: BuiltinKind) {
  const value = text.trim();

  if (kind === 'integer') {
    return parseInt(value, 10);
  }

  if (kind === 'decimal') {
    return parseFloat(value);
  }

  if (kind === 'boolean') {
    return value === 'true' || value === '1';
  }

  if (kind === 'date' || kind === 'dateTime') {
    return new Date(value);
  }

  return value;
}
