/// <reference lib="dom" />
import type { XMLDomDocument, XMLDomImplementation } from '../parser/index.js';
import type { XsSchema } from '../schema/index.js';
import { serializeWithXsSchema } from './schema.js';

export { SerializationError } from './error.js';

export function serialize(value: unknown, schema: XsSchema, implementation: XMLDomImplementation): XMLDomDocument {
  return serializeWithXsSchema(value, schema, implementation);
}
