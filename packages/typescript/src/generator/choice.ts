import ts from 'typescript';
import type { XsChoice } from 'xsd-tools';
import { generateFromSequence } from './sequence.js';
import { generateFromType } from './type.js';

export function generateFromChoice(xsChoice: XsChoice) {
  if ('xsElement' in xsChoice) {
    return ts.factory.createUnionTypeNode(xsChoice.xsElement.map((e) => ts.factory.createTypeLiteralNode([ts.factory.createPropertySignature(
      undefined,
      ts.factory.createIdentifier(e['@name']),
      undefined,
      generateFromType(e['@type'])
    )])))
  }

  return ts.factory.createUnionTypeNode(xsChoice.xsSequence.map((s) => generateFromSequence(s)));
}
