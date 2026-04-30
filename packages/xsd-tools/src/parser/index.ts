import { parseWithXsSchema } from './schema.js';
import { type XsSchema, xsdSchema } from '../schema/index.js';
import { ValidationError } from './error.js';

export function parse(document: Document, schema?: XsSchema) {
  const effectiveSchema = schema || xsdSchema;

  const ns = document.documentElement.getAttribute('targetNamespace');

  // check if document schema matches
  if (false) {
    throw new ValidationError('document does not use provided schema', document.documentElement);
  }

  const result = parseWithXsSchema(document.documentElement, effectiveSchema);

  return result;
}
