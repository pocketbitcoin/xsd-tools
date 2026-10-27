import ts from '@typescript/typescript6';
import type { XsComplexType } from 'xsd-tools';
import { generateFromAttributes } from './attribute.js';
import { generateFromChoice } from './choice.js';
import { generateFromSequence } from './sequence.js';
import { generateFromSimpleContent } from './simple-content.js';

export function generateFromComplexType(xsComplexType: XsComplexType) {
  let typeNode: ts.TypeNode;

  if ('xsSequence' in xsComplexType) {
    typeNode = generateFromSequence(xsComplexType.xsSequence);
  } else if ('xsChoice' in xsComplexType) {
    typeNode = generateFromChoice(xsComplexType.xsChoice);
  } else if ('xsSimpleContent' in xsComplexType) {
    typeNode = generateFromSimpleContent(xsComplexType.xsSimpleContent);
  } else {
    throw new Error(`unable to generate from "${JSON.stringify(xsComplexType)}"`);
  }

  if ('xsAttribute' in xsComplexType && xsComplexType.xsAttribute.length > 0) {
    typeNode = ts.factory.createIntersectionTypeNode([
      typeNode,
      ts.factory.createTypeLiteralNode(generateFromAttributes(xsComplexType.xsAttribute)),
    ]);
  }

  return ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(xsComplexType['@name'] || '_'),
    undefined,
    typeNode,
  );
}
