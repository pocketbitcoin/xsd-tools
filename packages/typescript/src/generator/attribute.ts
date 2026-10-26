import ts from '@typescript/typescript6';
import type { XsAttribute } from 'xsd-tools';
import { generateFromType } from './type.js';

export function generateFromAttributes(xsAttributes: XsAttribute[]) {
  return xsAttributes.map((xsAttribute) => ts.factory.createPropertySignature(
    undefined,
    ts.factory.createStringLiteral(`@${xsAttribute['@name']}`),
    xsAttribute['@use'] !== 'required' && !xsAttribute['@default'] ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
    generateFromType(xsAttribute['@type'])
  ));
}
