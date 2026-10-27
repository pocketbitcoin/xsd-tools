import type { XsComplexType } from '../schema/index.js';
import type { XMLDomElement } from '../dom.js';
import { serializeWithXsAttribute } from './attribute.js';
import { serializeWithXsChoice } from './choice.js';
import type { SerializationContext } from './context.js';
import { SerializationError } from './error.js';
import { serializeWithXsSequence } from './sequence.js';
import { serializeWithXsSimpleContent } from './simple-content.js';

export function serializeWithXsComplexType(element: XMLDomElement, value: any, xsComplexType: XsComplexType, context: SerializationContext, path: string) {
  if (typeof value !== 'object' || value === null) {
    throw new SerializationError('expected an object', path);
  }

  if ('xsSimpleContent' in xsComplexType) {
    serializeWithXsSimpleContent(element, value, xsComplexType.xsSimpleContent, context, path);

    return;
  }

  // attributes before children, so the document reads in source order
  if ('xsAttribute' in xsComplexType) {
    for (const xsAttribute of xsComplexType.xsAttribute) {
      serializeWithXsAttribute(element, value, xsAttribute, context, path);
    }
  }

  if ('xsSequence' in xsComplexType) {
    serializeWithXsSequence(element, value, xsComplexType.xsSequence, context, path);
  }

  if ('xsChoice' in xsComplexType) {
    serializeWithXsChoice(element, value, xsComplexType.xsChoice, context, path);
  }
}
