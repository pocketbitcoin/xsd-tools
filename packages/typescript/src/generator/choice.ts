import ts from 'typescript';
import { XsChoice } from 'xsd-tools';
import { generateFromSequence } from './sequence';

export function generateFromChoice(xsChoice: XsChoice) {
  if ('xsElement' in xsChoice) {
    return ts.factory.createUnionTypeNode(xsChoice.xsElement.map((e) => ts.factory.createTypeLiteralNode([ts.factory.createPropertySignature(
      undefined,
      ts.factory.createIdentifier(e['@name']),
      undefined,
      ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier(e['@type']),
        undefined
      )
    )])))
  }

  return ts.factory.createUnionTypeNode(xsChoice.xsSequence.map((s) => generateFromSequence(s)));
}
