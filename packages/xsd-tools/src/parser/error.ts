import type { XMLDomElement } from '../dom.js';

export class ValidationError extends Error {
  element: XMLDomElement;
  errors: ValidationError[];

  constructor(message: string, element: XMLDomElement, errors: ValidationError[] = []) {
    super(`${message} at element ${element} ${errors.map((e) => e.message)}`);

    Object.setPrototypeOf(this, ValidationError.prototype);

    this.name = 'ValidationError';
    this.element = element;
    this.errors = errors;
  }
}
