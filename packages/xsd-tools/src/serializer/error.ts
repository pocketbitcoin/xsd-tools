export class SerializationError extends Error {
  path: string;
  errors: SerializationError[];

  constructor(message: string, path: string, errors: SerializationError[] = []) {
    super(`${message} at ${path} ${errors.map((e) => e.message)}`);

    Object.setPrototypeOf(this, SerializationError.prototype);

    this.name = 'SerializationError';
    this.path = path;
    this.errors = errors;
  }
}
