import ts from 'typescript';
import { XsSequence } from 'xsd-tools';

export function generateFromSequence(xsSequence: XsSequence) {
  if (xsSequence.xsAny) {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
  }

  return ts.factory.createTypeLiteralNode(xsSequence.xsElement.map((e) => {
    let typeNode: ts.TypeNode;
    let optional: boolean;

    if (e['@maxOccurs'] > 1 || e['@maxOccurs'] === 'unbounded') {
      const typeReferenceNode = ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier(e['@type']),
        undefined
      )

      typeNode = ts.factory.createArrayTypeNode(typeReferenceNode)

      if (e['@minOccurs'] > 1) {
        typeNode = ts.factory.createIntersectionTypeNode([
          typeNode,
          ts.factory.createTypeLiteralNode(new Array(e['@minOccurs']).fill(0).map((i) => ts.factory.createPropertySignature(
            undefined,
            ts.factory.createNumericLiteral(i),
            undefined,
            typeReferenceNode,
          )))
        ])
      }
    } else {
      typeNode = ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier(e['@type']),
        undefined
      );
    }

    optional = e['@minOccurs'] === 0;

    return ts.factory.createPropertySignature(
      undefined,
      ts.factory.createIdentifier(e['@name']),
      optional ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
      typeNode,
    );
  }));
}
