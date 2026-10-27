import { ValidationError } from './error.js';
import type { XMLDomElement } from '../dom.js';
import { resolveType, type XsSchema, type XsAttribute } from '../schema/index.js';
import { parseText } from './simple-type.js';

export function parseWithXsAttribute(element: XMLDomElement, xsAttribute: XsAttribute, xsSchema: XsSchema) {
  const value = element.getAttribute(xsAttribute['@name']) || xsAttribute['@default'] || null;

  if (xsAttribute['@use'] === 'required' && value === null) {
    throw new ValidationError(`attribute ${xsAttribute['@name']} is required`, element);
  }

  if (value === null) {
    return undefined;
  }

  if (xsAttribute['@type'] === 'xs:nonNegativeIntegerOrUnbounded') {
    if (value.trim() === 'unbounded') {
      return 'unbounded';
    }

    return parseInt(value.trim(), 10);
  }

  return parseText(value, resolveType(xsAttribute['@type'], xsSchema).kind);
}
