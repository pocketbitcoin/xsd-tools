import type { XsElement } from '../schema/index.js';
import { serializeWithXsComplexType } from './complex-type.js';
import type { SerializationContext } from './context.js';
import { formatWithType } from './format.js';
import { serializeWithXsSimpleType } from './simple-type.js';

export function serializeWithXsElement(element: Element, value: unknown, xsElement: XsElement, context: SerializationContext, path: string) {
  const xsComplexType = context.xsSchema.xsComplexType.find((t) => t['@name'] === xsElement['@type']);

  if (xsComplexType) {
    serializeWithXsComplexType(element, value, xsComplexType, context, path);

    return;
  }

  const xsSimpleType = context.xsSchema.xsSimpleType.find((t) => t['@name'] === xsElement['@type']);

  if (xsSimpleType) {
    serializeWithXsSimpleType(element, value, xsSimpleType, context, path);

    return;
  }

  // built-in types such as xs:string
  if (value !== null) {
    element.appendChild(context.document.createTextNode(formatWithType(value, xsElement['@type'], context.xsSchema, path)));
  }
}
