import type { XsElement, XsSchema } from '../schema/index.js';
import { parseWithXsComplexType } from './complex-type.js';
import { parseWithType, parseWithXsSimpleType } from './simple-type.js';

export function parseWithXsElement(element: Element, xsElement: XsElement, xsSchema: XsSchema) {
  const xsComplexType = xsSchema.xsComplexType.find((t) => t['@name'] === xsElement['@type']);

  if (xsComplexType) {
    return parseWithXsComplexType(element, xsComplexType, xsSchema);
  }

  const xsSimpleType = xsSchema.xsSimpleType.find((t) => t['@name'] === xsElement['@type']);

  if (xsSimpleType) {
    return parseWithXsSimpleType(element, xsSimpleType, xsSchema);
  }

  // built-in types such as xs:string
  return parseWithType(element, xsElement['@type'], xsSchema);
}
