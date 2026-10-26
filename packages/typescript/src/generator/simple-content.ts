import ts from 'typescript';
import type { XsSimpleContent } from 'xsd-tools';
import { generateFromAttributes } from './attribute.js';
import { generateFromType } from './type.js';

export function generateFromSimpleContent(xsSimpleContent: XsSimpleContent) {
  const { xsExtension } = xsSimpleContent;

  const properties = [] as ts.TypeElement[];

  properties.push(
    ts.factory.createPropertySignature(
      undefined,
      ts.factory.createStringLiteral('#'),
      undefined,
      generateFromType(xsExtension['@base'])
    )
  );

  properties.push(...generateFromAttributes(xsExtension.xsAttribute));

  return ts.factory.createTypeLiteralNode(properties);
}
