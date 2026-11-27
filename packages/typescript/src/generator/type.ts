import ts from '@typescript/typescript6';
import { builtinKind } from 'xsd-tools';

// the structure of XsDate, XsTime and XsDateTime: { [kind]: string, tz?: string }
function generateTemporal(kind: string): ts.TypeNode {
  const string = () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);

  return ts.factory.createTypeLiteralNode([
    ts.factory.createPropertySignature(undefined, kind, undefined, string()),
    ts.factory.createPropertySignature(undefined, 'tz', ts.factory.createToken(ts.SyntaxKind.QuestionToken), string()),
  ]);
}

// built-in xs:* types map to the javascript value the parser returns,
// any other type is a reference to a type generated from the schema
export function generateFromType(type: string): ts.TypeNode {
  if (!type.startsWith('xs:')) {
    return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(type), undefined);
  }

  switch (builtinKind(type)) {
    case 'integer':
    case 'decimal':
    case 'float':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    case 'boolean':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
    // inlined rather than imported, so that they cannot clash with schema type names
    case 'date':
    case 'time':
    case 'dateTime':
      return generateTemporal(builtinKind(type));
    case 'string':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
  }
}
