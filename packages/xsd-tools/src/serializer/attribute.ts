import type { XsAttribute } from '../schema/index.js';
import type { SerializationContext } from './context.js';
import { SerializationError } from './error.js';
import { formatWithType } from './format.js';
import { camelCase } from '../parser/utils.js';

export function serializeWithXsAttribute(element: Element, value: any, xsAttribute: XsAttribute, context: SerializationContext, path: string) {
  const key = camelCase(`@${xsAttribute['@name']}`);
  const attributeValue = value[key];

  if (attributeValue === undefined || attributeValue === null) {
    if (xsAttribute['@use'] === 'required' && xsAttribute['@default'] === undefined) {
      throw new SerializationError(`attribute ${xsAttribute['@name']} is required`, path);
    }

    return;
  }

  element.setAttribute(xsAttribute['@name'], formatWithType(attributeValue, xsAttribute['@type'], context.xsSchema, `${path}/${key}`));
}
