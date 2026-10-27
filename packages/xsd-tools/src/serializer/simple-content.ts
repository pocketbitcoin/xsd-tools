import type { XsSimpleContent } from '../schema/index.js';
import type { XMLDomElement } from '../dom.js';
import { serializeWithXsAttribute } from './attribute.js';
import type { SerializationContext } from './context.js';
import { formatWithType } from './format.js';

export function serializeWithXsSimpleContent(element: XMLDomElement, value: any, xsSimpleContent: XsSimpleContent, context: SerializationContext, path: string) {
  const { xsExtension } = xsSimpleContent;

  for (const xsAttribute of xsExtension.xsAttribute) {
    serializeWithXsAttribute(element, value, xsAttribute, context, path);
  }

  element.appendChild(context.document.createTextNode(formatWithType(value['#'], xsExtension['@base'], context.xsSchema, `${path}/#`)));
}
