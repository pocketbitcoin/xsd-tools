import type { XsSimpleType } from '../schema/index.js';
import type { SerializationContext } from './context.js';
import { formatWithXsRestriction } from './format.js';

export function serializeWithXsSimpleType(element: Element, value: unknown, xsSimpleType: XsSimpleType, context: SerializationContext, path: string) {
  element.appendChild(context.document.createTextNode(formatWithXsRestriction(value, xsSimpleType.xsRestriction, context.xsSchema, path)));
}
