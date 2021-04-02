import { parseWithXsElement } from './element';
import { ValidationError } from './error';
import { camelCase } from './utils';
import { XsSchema } from '../schema';

export function parseWithXsSchema(element: Element, xsSchema: XsSchema) {
  const errors = [] as ValidationError[];

  for (const xsElement of xsSchema.xsElement) {
    try {
      return {
        [camelCase(element.tagName)]: parseWithXsElement(element, xsElement, xsSchema),
      };
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
