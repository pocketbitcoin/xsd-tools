import ts, { TypeNode } from 'typescript';
import { XsSimpleType } from 'xsd-tools';

export function generateFromSimpleType(xsSimpleType: XsSimpleType) {
  let typeNode: TypeNode;

  const { xsRestriction } = xsSimpleType;

  if (xsRestriction.xsEnumeration && xsRestriction.xsEnumeration.length > 0) {
    typeNode = ts.factory.createUnionTypeNode(xsRestriction.xsEnumeration.map((xsEnumeration) => ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(xsEnumeration['@value']))));
  } else if (xsRestriction['@base'] === 'xs:string') {
    typeNode = ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
  } else if (xsRestriction['@base'] === 'xs:integer') {
    typeNode = ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
  } else if (xsRestriction['@base'] === 'xs:decimal') {
    typeNode = ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
  } else if (xsRestriction['@base'] === 'xs:boolean') {
    typeNode = ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
  } else if (xsRestriction['@base'] === 'xs:date') {
    typeNode = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('Date'), undefined);
  } else if (xsRestriction['@base'] === 'xs:dateTime') {
    typeNode = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('Date'), undefined);
  } else if (xsRestriction['@base'] === 'xs:gYearMonth') {
    typeNode = ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
  } else {
    throw new Error(`unknown base type "${xsRestriction['@base']}"`);
  }

  return ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(xsSimpleType['@name'] || '_'),
    undefined,
    typeNode,
  );
}
