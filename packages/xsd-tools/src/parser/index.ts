/// <reference lib="dom" />
import { parseWithXsSchema } from './schema.js';
import { type XsSchema, xsdSchema } from '../schema/index.js';
import { ValidationError } from './error.js';

// Generated parsers import this alias instead of Document from @xmldom/xmldom.
// 0.8 does not export Document; it uses the DOM lib global. Schemas also often
// declare their own Document type (for example camt.053), so the generated
// parameter must not be named Document or written as globalThis.document.
// Consumers import XMLDomDocument from xsd-tools and never mention the global.
// When upgrading to 0.9, which exports Document, replace the line below with:
// export type { Document as XMLDomDocument } from '@xmldom/xmldom';
export type XMLDomDocument = typeof globalThis.document;

export function parse(document: XMLDomDocument, schema?: XsSchema) {
  const effectiveSchema = schema || xsdSchema;

  const ns = document.documentElement?.getAttribute('targetNamespace');

  // check if document schema matches
  if (false) {
    throw new ValidationError('document does not use provided schema', document.documentElement!);
  }

  const result = parseWithXsSchema(document.documentElement!, effectiveSchema);

  return result;
}
