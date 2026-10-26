import ts from 'typescript';
import type { XsAttribute } from 'xsd-tools';

function generateAttributeType(type: string) {
  switch (type) {
    case 'xs:string':
    case 'xs:gYearMonth':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
    case 'xs:integer':
    case 'xs:decimal':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    case 'xs:boolean':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
    case 'xs:date':
    case 'xs:dateTime':
      return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('Date'), undefined);
    default:
      return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(type), undefined);
  }
}

export function generateFromAttributes(xsAttributes: XsAttribute[]) {
  return xsAttributes.map((xsAttribute) => ts.factory.createPropertySignature(
    undefined,
    ts.factory.createStringLiteral(`@${xsAttribute['@name']}`),
    xsAttribute['@use'] !== 'required' && !xsAttribute['@default'] ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
    generateAttributeType(xsAttribute['@type'])
  ));
}
