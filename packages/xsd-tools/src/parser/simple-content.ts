import { parseWithType } from './simple-type.js';
import type { XMLDomElement } from '../dom.js';
import type { XsSchema, XsSimpleContent } from '../schema/index.js';
import { camelCase } from './utils.js';
import { parseWithXsAttribute } from './attribute.js';

export function parseWithXsSimpleContent(element: XMLDomElement, xsSimpleContent: XsSimpleContent, xsSchema: XsSchema) {
  const { xsExtension } = xsSimpleContent;

  const result = {} as any;

  for (const xsAttribute of xsSimpleContent.xsExtension.xsAttribute) {
    const value = parseWithXsAttribute(element, xsAttribute, xsSchema);

    if (value !== undefined) {
      result[camelCase(`@${xsAttribute['@name']}`)] = value;
    }
  }

  result['#'] = parseWithType(element, xsExtension['@base'], xsSchema);

  return result;
}
