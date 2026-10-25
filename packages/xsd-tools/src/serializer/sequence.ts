import type { XsSequence } from '../schema/index.js';
import { appendElement, type SerializationContext } from './context.js';
import { serializeWithXsElement } from './element.js';
import { SerializationError } from './error.js';
import { camelCase } from '../parser/utils.js';

export function serializeWithXsSequence(element: Element, value: any, xsSequence: XsSequence, context: SerializationContext, path: string) {
  // elements are written in schema order, not in object key order
  for (const xsElement of xsSequence.xsElement) {
    const key = camelCase(xsElement['@name']);
    const elementValue = value[key];

    if (typeof xsElement['@maxOccurs'] === 'number' && xsElement['@maxOccurs'] > 1 || xsElement['@maxOccurs'] === 'unbounded') {
      const list = elementValue ?? [];

      if (!Array.isArray(list)) {
        throw new SerializationError('expected a list', `${path}/${key}`);
      }

      if (list.length < xsElement['@minOccurs']) {
        throw new SerializationError(`was expected at least ${xsElement['@minOccurs']} times`, `${path}/${key}`);
      }

      if (typeof xsElement['@maxOccurs'] === 'number' && list.length > xsElement['@maxOccurs']) {
        throw new SerializationError(`was expected at most ${xsElement['@maxOccurs']} times`, `${path}/${key}`);
      }

      list.forEach((item, index) => {
        const child = appendElement(element, xsElement['@name'], context.namespace, context);

        serializeWithXsElement(child, item, xsElement, context, `${path}/${key}/${index}`);
      });

      continue;
    }

    if (elementValue === undefined) {
      if (xsElement['@minOccurs'] !== 0) {
        throw new SerializationError('was expected at least once', `${path}/${key}`);
      }

      continue;
    }

    const child = appendElement(element, xsElement['@name'], context.namespace, context);

    serializeWithXsElement(child, elementValue, xsElement, context, `${path}/${key}`);
  }
}

// mirrors the parser, which accepts a sequence as soon as all required elements are present
export function matchesXsSequence(value: any, xsSequence: XsSequence) {
  return xsSequence.xsElement.every((xsElement) => xsElement['@minOccurs'] === 0 || value[camelCase(xsElement['@name'])] !== undefined);
}
