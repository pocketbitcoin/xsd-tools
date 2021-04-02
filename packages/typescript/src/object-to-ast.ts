import ts from 'typescript';

export function objectToAst(obj: any): ts.Expression {
  if (obj === null) {
    return ts.factory.createNull();
  }

  if (obj === undefined) {
    return ts.factory.createIdentifier('undefined');
  }

  if (typeof obj === 'string') {
    return ts.factory.createStringLiteral(obj);
  }

  if (typeof obj === 'number') {
    return ts.factory.createNumericLiteral(obj);
  }

  if (Array.isArray(obj)) {
    return ts.factory.createArrayLiteralExpression(obj.map(objectToAst), true);
  }

  const assignments = [] as ts.PropertyAssignment[];

  for (const prop in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
      continue;
    }

    assignments.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createStringLiteral(prop),
        objectToAst(obj[prop])
      )
    );
  }

  return ts.factory.createObjectLiteralExpression(assignments, false);
}
