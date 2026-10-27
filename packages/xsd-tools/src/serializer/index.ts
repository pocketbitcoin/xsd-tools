import type { XMLDomDocument, XMLDomImplementation } from '../dom.js';
import type { XsSchema } from '../schema/index.js';
import { serializeWithXsSchema } from './schema.js';

export { SerializationError } from './error.js';

export function serialize<D extends XMLDomDocument>(value: unknown, schema: XsSchema, implementation: XMLDomImplementation<D>): D {
  return serializeWithXsSchema(value, schema, implementation);
}
