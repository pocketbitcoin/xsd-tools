import type { XsChoice } from '../schema/index.js';
import type { SerializationContext } from './context.js';
import { SerializationError } from './error.js';
import { matchesXsSequence, serializeWithXsSequence } from './sequence.js';

export function serializeWithXsChoice(element: Element, value: any, xsChoice: XsChoice, context: SerializationContext, path: string) {
  const xsSequences = 'xsElement' in xsChoice
    ? xsChoice.xsElement.map((xsElement) => ({ xsElement: [xsElement] }))
    : xsChoice.xsSequence;

  const xsSequence = xsSequences.find((s) => matchesXsSequence(value, s));

  if (!xsSequence) {
    throw new SerializationError('none of the choices matched', path);
  }

  serializeWithXsSequence(element, value, xsSequence, context, path);
}
