import type { XsSchema, XsSequence } from '../schema/index.js';
import { parseWithXsElement } from './element.js';
import { ValidationError } from './error.js';
import { camelCase } from './utils.js';

export function parseWithXsSequence(element: Element, xsSequence: XsSequence, xsSchema: XsSchema) {
  const result = {} as any;

  for (const xsElement of xsSequence.xsElement) {
    if (typeof xsElement['@maxOccurs'] === 'number' && xsElement['@maxOccurs'] > 1 || xsElement['@maxOccurs'] === 'unbounded') {
      const list = [];

      for (let node = element.firstChild; node !== null; node = node.nextSibling) {
        if (node.nodeType !== node.ELEMENT_NODE) {
          continue;
        }

        const element = node as Element;

        if (xsElement['@name'] !== element.tagName) {
          continue;
        }

        list.push(parseWithXsElement(element, xsElement, xsSchema));
      }

      result[camelCase(xsElement['@name'])] = list;

      continue;
    }

    // result[camelCase(xsElement['@name'])] = null;

    for (let node = element.firstChild; node !== null; node = node.nextSibling) {
      if (node.nodeType !== node.ELEMENT_NODE) {
        continue;
      }

      const element = node as Element;

      if (xsElement['@name'] !== element.tagName) {
        continue;
      }

      if (result[camelCase(element.tagName)]) {
        throw new ValidationError('cannot occur multiple times', element);
      }

      result[camelCase(element.tagName)] = parseWithXsElement(element, xsElement, xsSchema);
    }

    if (xsElement['@minOccurs'] !== 0 && !result[camelCase(xsElement['@name'])]) {
      throw new ValidationError('was expected at least once', element);
    }
  }

  return result;
}
