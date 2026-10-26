import ts from 'typescript';
import { builtinKind } from 'xsd-tools';

// built-in xs:* types map to the javascript value the parser returns,
// any other type is a reference to a type generated from the schema
export function generateFromType(type: string): ts.TypeNode {
  if (!type.startsWith('xs:')) {
    return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(type), undefined);
  }

  switch (builtinKind(type)) {
    case 'integer':
    case 'decimal':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    case 'boolean':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
    case 'date':
    case 'dateTime':
      return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('Date'), undefined);
    case 'string':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
  }
}
