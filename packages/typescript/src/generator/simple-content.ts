import ts from 'typescript';
import type { XsSimpleContent } from 'xsd-tools';
import { generateFromAttributes } from './attribute.js';

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

  properties.push(...generateFromAttributes(xsExtension.xsAttribute));

  return ts.factory.createTypeLiteralNode(properties);
}
