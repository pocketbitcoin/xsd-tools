import { XsSchema, XsSimpleType } from '../schema';
import { ValidationError } from './error';

export function parseWithXsSimpleType(element: Element, xsSimpleType: XsSimpleType, xsSchema: XsSchema) {
  if (!element) {
    throw new ValidationError('element required', element);
  }

  const { xsRestriction } = xsSimpleType;

  if (xsRestriction['@base'] === 'xs:integer') {
    if (!element.textContent) throw new ValidationError('was empty', element);

    return parseInt(element.textContent.trim(), 10);
  }

  if (xsRestriction['@base'] === 'xs:decimal') {
    if (!element.textContent) throw new ValidationError('was empty', element);

    return parseFloat(element.textContent.trim());
  }

  if (xsRestriction['@base'] === 'xs:string') {
    if (!element.textContent) throw new ValidationError('was empty', element);

    return element.textContent.trim();
  }

  if (xsRestriction['@base'] === 'xs:date') {
    if (!element.textContent) throw new ValidationError('was empty', element);

    return new Date(element.textContent.trim());
  }

  if (xsRestriction['@base'] === 'xs:dateTime') {
    if (!element.textContent) throw new ValidationError('was empty', element);

    return new Date(element.textContent.trim());
  }

  if (xsRestriction['@base'] === 'xs:boolean') {
    if (!element.textContent) throw new ValidationError('was empty', element);

    return Boolean(element.textContent.trim());
  }

  throw new ValidationError('unknown restriction', element);
}
