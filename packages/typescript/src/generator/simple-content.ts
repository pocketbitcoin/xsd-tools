import ts from 'typescript';
import { XsSimpleContent } from 'xsd-tools';

export function generateFromSimpleContent(xsSimpleContent: XsSimpleContent) {
  const { xsExtension } = xsSimpleContent;

  const properties = [] as ts.TypeElement[];

  properties.push(
    ts.factory.createPropertySignature(
      undefined,
      ts.factory.createStringLiteral('#'),
      undefined,
      ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier(xsExtension['@base']),
        undefined
      )
    )
  );

  for (const xsAttribute of xsExtension.xsAttribute) {
    properties.push(
      ts.factory.createPropertySignature(
        undefined,
        ts.factory.createStringLiteral(`@${xsAttribute['@name']}`),
        xsAttribute['@use'] !== 'required' && !xsAttribute['@default'] ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
        ts.factory.createTypeReferenceNode(
          ts.factory.createIdentifier(xsAttribute['@type']),
          undefined
        )
      )
    );
  }

  return ts.factory.createTypeLiteralNode(properties);
}
