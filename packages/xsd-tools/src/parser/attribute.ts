import { ValidationError } from './error';
import { XsSchema, XsAttribute } from '../schema';

export function parseWithXsAttribute(element: Element, xsAttribute: XsAttribute, xsSchema: XsSchema) {
  const value = element.getAttribute(xsAttribute['@name']) || xsAttribute['@default'] || null;

  if (xsAttribute['@use'] === 'required' && value === null) {
    throw new ValidationError(`attribute ${xsAttribute['@name']} is required`, element);
  }

  if (value === null) {
    return undefined;
  }

  if (xsAttribute['@type'] === 'xs:integer') {
    return parseInt(value.trim(), 10);
  }

  if (xsAttribute['@type'] === 'xs:nonNegativeInteger') {
    return parseInt(value.trim(), 10);
  }

  if (xsAttribute['@type'] === 'xs:nonNegativeIntegerOrUnbounded') {
    if (value.trim() === 'unbounded') {
      return 'unbounded';
    }

    return parseInt(value.trim(), 10);
  }

  return value.trim();
}
