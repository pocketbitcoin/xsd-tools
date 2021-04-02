import { XsElement, XsSchema } from '../schema';
import { parseWithXsComplexType } from './complex-type';
import { parseWithXsSimpleType } from './simple-type';

export function parseWithXsElement(element: Element, xsElement: XsElement, xsSchema: XsSchema) {
  const xsComplexType = xsSchema.xsComplexType.find((t) => t['@name'] === xsElement['@type']);

  if (xsComplexType) {
    return parseWithXsComplexType(element, xsComplexType, xsSchema);
  }

  const xsSimpleType = xsSchema.xsSimpleType.find((t) => t['@name'] === xsElement['@type']);

  if (xsSimpleType) {
    return parseWithXsSimpleType(element, xsSimpleType, xsSchema);
  }

  return null;
}
