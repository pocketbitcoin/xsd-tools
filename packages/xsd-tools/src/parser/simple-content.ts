import { parseWithXsSimpleType } from './simple-type.js';
import type { XsSchema, XsSimpleContent } from '../schema/index.js';
import { camelCase } from './utils.js';
import { parseWithXsAttribute } from './attribute.js';

export function parseWithXsSimpleContent(element: Element, xsSimpleContent: XsSimpleContent, xsSchema: XsSchema) {
  const { xsExtension } = xsSimpleContent;

  const result = {} as any;

  for (const xsAttribute of xsSimpleContent.xsExtension.xsAttribute) {
    const value = parseWithXsAttribute(element, xsAttribute, xsSchema);

    if (value !== null) {
      result[camelCase(`@${xsAttribute['@name']}`)] = value;
    }
  }

  const xsSimpleType = xsSchema.xsSimpleType.find((t) => t['@name'] === xsExtension['@base']);

  if (xsSimpleType) {
    result['#'] = parseWithXsSimpleType(element, xsSimpleType, xsSchema);
  } else {
    result['#'] = null;
  }

  return result;
}
