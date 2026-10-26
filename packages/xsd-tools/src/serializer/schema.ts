import type { XsSchema } from '../schema/index.js';
import type { XMLDomDocument, XMLDomImplementation } from '../parser/index.js';
import { serializeWithXsElement } from './element.js';
import { SerializationError } from './error.js';
import { camelCase } from '../parser/utils.js';

export function serializeWithXsSchema(value: any, xsSchema: XsSchema, implementation: XMLDomImplementation): XMLDomDocument {
  if (typeof value !== 'object' || value === null) {
    throw new SerializationError('expected an object', '');
  }

  // mirrors parseWithXsSchema, which keys the result by the root element name
  const xsElement = xsSchema.xsElement.find((e) => value[camelCase(e['@name'])] !== undefined);

  if (!xsElement) {
    throw new SerializationError(`none of the root elements ${xsSchema.xsElement.map((e) => e['@name']).join(', ')} found`, '');
  }

  const targetNamespace = xsSchema['@targetNamespace'] ?? null;
  const document = implementation.createDocument(targetNamespace, xsElement['@name'], null);

  document.insertBefore(
    document.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"'),
    document.documentElement,
  );

  const key = camelCase(xsElement['@name']);

  serializeWithXsElement(document.documentElement, value[key], xsElement, {
    document,
    xsSchema,
    namespace: xsSchema['@elementFormDefault'] === 'qualified' ? targetNamespace : null,
  }, `/${key}`);

  return document;
}
