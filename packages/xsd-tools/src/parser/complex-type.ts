import type { Element } from '@xmldom/xmldom';
import type { XsComplexType, XsSchema } from '../schema/index.js';
import { parseWithXsAttribute } from './attribute.js';
import { parseWithXsChoice } from './choice.js';
import { parseWithXsSequence } from './sequence.js';
import { parseWithXsSimpleContent } from './simple-content.js';
import { camelCase } from './utils.js';

export function parseWithXsComplexType(element: Element, xsComplexType: XsComplexType, xsSchema: XsSchema) {
  if ('xsSimpleContent' in xsComplexType) {
    return parseWithXsSimpleContent(element, xsComplexType.xsSimpleContent, xsSchema);
  }

  let result: any = {};

  if ('xsSequence' in xsComplexType) {
    result = parseWithXsSequence(element, xsComplexType.xsSequence, xsSchema);
  }

  if ('xsChoice' in xsComplexType) {
    result = parseWithXsChoice(element, xsComplexType.xsChoice, xsSchema);
  }

  if ('xsAttribute' in xsComplexType) {
    for (const xsAttribute of xsComplexType.xsAttribute) {
      const value = parseWithXsAttribute(element, xsAttribute, xsSchema);

      if (value === undefined) {
        continue;
      }

      result[camelCase(`@${xsAttribute['@name']}`)] = value;
    }
  }

  return result;
}
