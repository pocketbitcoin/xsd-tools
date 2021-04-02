import { XsSchema, XsChoice } from '../schema';
import { ValidationError } from './error';
import { parseWithXsSequence } from './sequence';

export function parseWithXsChoice(element: Element, xsChoice: XsChoice, xsSchema: XsSchema) {
  if ('xsElement' in xsChoice) {
    const errors = [] as ValidationError[];

    for (const xsElement of xsChoice.xsElement) {
      try {
        return parseWithXsSequence(element, { xsElement: [xsElement] }, xsSchema);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(error);

          // skip to next root-level xsElement declaration
          continue;
        }

        throw error;
      }
    }

    throw new ValidationError('none of the root elements matched', element, errors);
  }

  if ('xsSequence' in xsChoice) {
    const errors = [] as ValidationError[];

    for (const xsSequence of xsChoice.xsSequence) {
      try {
        return parseWithXsSequence(element, xsSequence, xsSchema);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(error);

          // skip to next root-level xsElement declaration
          continue;
        }

        throw error;
      }
    }

    throw new ValidationError('none of the root elements matched', element, errors);
  }
}
