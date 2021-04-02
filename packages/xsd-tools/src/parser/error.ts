export class ValidationError extends Error {
  element: Element;
  errors: ValidationError[];

  constructor(message: string, element: Element, errors: ValidationError[] = []) {
    super(`${message} at element ${element} ${errors.map((e) => e.message)}`);

    Object.setPrototypeOf(this, ValidationError.prototype);

    this.name = 'ValidationError';
    this.element = element;
    this.errors = errors;
  }
}
