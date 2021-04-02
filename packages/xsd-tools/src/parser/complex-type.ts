import { XsComplexType, XsSchema } from '../schema';
import { parseWithXsAttribute } from './attribute';
import { parseWithXsChoice } from './choice';
import { parseWithXsSequence } from './sequence';
import { parseWithXsSimpleContent } from './simple-content';
import { camelCase } from './utils';

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
