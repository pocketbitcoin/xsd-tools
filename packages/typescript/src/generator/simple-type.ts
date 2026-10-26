import ts, { type TypeNode } from 'typescript';
import type { XsSimpleType } from 'xsd-tools';
import { generateFromType } from './type.js';

export function generateFromSimpleType(xsSimpleType: XsSimpleType) {
  let typeNode: TypeNode;

  const { xsRestriction } = xsSimpleType;

  if (xsRestriction.xsEnumeration && xsRestriction.xsEnumeration.length > 0) {
    typeNode = ts.factory.createUnionTypeNode(xsRestriction.xsEnumeration.map((xsEnumeration) => ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(xsEnumeration['@value']))));
  } else {
    typeNode = generateFromType(xsRestriction['@base']);
  }

  return ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(xsSimpleType['@name'] || '_'),
    undefined,
    typeNode,
  );
}
