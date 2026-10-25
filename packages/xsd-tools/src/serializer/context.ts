import type { XMLDomDocument } from '../parser/index.js';
import type { XsSchema } from '../schema/index.js';

export type SerializationContext = {
  document: XMLDomDocument,
  xsSchema: XsSchema,
  // namespace of elements declared locally within complex types
  namespace: string | null,
};

export function appendElement(parent: Element, name: string, namespace: string | null, context: SerializationContext) {
  const element = context.document.createElementNS(namespace, name);

  // xmldom does not undeclare the parent's default namespace by itself
  if (namespace === null && parent.namespaceURI !== null) {
    element.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', '');
  }

  parent.appendChild(element);

  return element;
}
