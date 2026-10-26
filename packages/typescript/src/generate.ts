import ts from '@typescript/typescript6';
import { parse, type XMLDomDocument, type XsSchema } from 'xsd-tools';
import { generateFromChoice } from './generator/choice.js';
import { generateFromComplexType } from './generator/complex-type.js';
import { generateFromSimpleType } from './generator/simple-type.js';
import { objectToAst } from './object-to-ast.js';

export function generate(doc: XMLDomDocument) {
  const { xsSchema } = parse(doc) as { xsSchema: XsSchema };

  const sourceFile = ts.createSourceFile(
    'parser.ts',
    '',
    ts.ScriptTarget.ES2022,
    false,
    ts.ScriptKind.TS
  );

  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false,
  });

  const simpleTypes = xsSchema.xsSimpleType.map((s) =>
    generateFromSimpleType(s)
  );

  const complexTypes = xsSchema.xsComplexType.map((c) =>
    generateFromComplexType(c)
  );

  const importStatement = ts.factory.createImportDeclaration(
    undefined,
    ts.factory.createImportClause(
      false,
      undefined,
      ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(
          false,
          ts.factory.createIdentifier('parse'),
          ts.factory.createIdentifier('parseXml')
        ),
        ts.factory.createImportSpecifier(
          false,
          ts.factory.createIdentifier('serialize'),
          ts.factory.createIdentifier('serializeXml')
        ),
        ts.factory.createImportSpecifier(
          true,
          undefined,
          ts.factory.createIdentifier('XMLDomDocument')
        ),
        ts.factory.createImportSpecifier(
          true,
          undefined,
          ts.factory.createIdentifier('XMLDomImplementation')
        ),
        ts.factory.createImportSpecifier(
          true,
          undefined,
          ts.factory.createIdentifier('XsSchema')
        ),
      ])
    ),
    ts.factory.createStringLiteral('xsd-tools')
  );

  ts.addSyntheticLeadingComment(
    importStatement,
    ts.SyntaxKind.MultiLineCommentTrivia,
    ' do not edit, but regenerate using xsd-tools ',
    true
  );

  const file = printer.printList(
    ts.ListFormat.MultiLine,
    ts.factory.createNodeArray(
      [
        importStatement,

        ts.factory.createTypeAliasDeclaration(
          [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
          ts.factory.createIdentifier('_'),
          undefined,
          generateFromChoice({
            xsElement: xsSchema.xsElement,
          })
        ),

        ...simpleTypes,
        ...complexTypes,

        ts.factory.createVariableStatement(
          undefined,
          ts.factory.createVariableDeclarationList(
            [
              ts.factory.createVariableDeclaration(
                ts.factory.createIdentifier('schema'),
                undefined,
                ts.factory.createTypeReferenceNode(
                  ts.factory.createIdentifier('XsSchema'),
                  undefined
                ),
                objectToAst(xsSchema)
              ),
            ],
            ts.NodeFlags.Const
          )
        ),

        ts.factory.createFunctionDeclaration(
          [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
          undefined,
          ts.factory.createIdentifier('parse'),
          undefined,
          [
            ts.factory.createParameterDeclaration(
              undefined,
              undefined,
              ts.factory.createIdentifier('doc'),
              undefined,
              ts.factory.createTypeReferenceNode(
                ts.factory.createIdentifier('XMLDomDocument'),
                undefined
              ),
              undefined
            ),
          ],
          undefined,
          ts.factory.createBlock(
            [
              ts.factory.createReturnStatement(
                ts.factory.createAsExpression(
                  ts.factory.createCallExpression(
                    ts.factory.createIdentifier('parseXml'),
                    undefined,
                    [
                      ts.factory.createIdentifier('doc'),
                      ts.factory.createIdentifier('schema'),
                    ]
                  ),
                  ts.factory.createTypeReferenceNode(
                    ts.factory.createIdentifier('_'),
                    undefined
                  )
                )
              ),
            ],
            true
          )
        ),

        // kept for backwards compatibility with `import parse from`
        ts.factory.createExportAssignment(
          undefined,
          false,
          ts.factory.createIdentifier('parse')
        ),

        ts.factory.createFunctionDeclaration(
          [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
          undefined,
          ts.factory.createIdentifier('serialize'),
          // generic, so callers get back their own DOM's document type
          [
            ts.factory.createTypeParameterDeclaration(
              undefined,
              ts.factory.createIdentifier('TDocument'),
              ts.factory.createTypeReferenceNode(
                ts.factory.createIdentifier('XMLDomDocument'),
                undefined
              ),
              undefined
            ),
          ],
          [
            ts.factory.createParameterDeclaration(
              undefined,
              undefined,
              ts.factory.createIdentifier('value'),
              undefined,
              ts.factory.createTypeReferenceNode(
                ts.factory.createIdentifier('_'),
                undefined
              ),
              undefined
            ),
            ts.factory.createParameterDeclaration(
              undefined,
              undefined,
              ts.factory.createIdentifier('implementation'),
              undefined,
              ts.factory.createTypeReferenceNode(
                ts.factory.createIdentifier('XMLDomImplementation'),
                [
                  ts.factory.createTypeReferenceNode(
                    ts.factory.createIdentifier('TDocument'),
                    undefined
                  ),
                ]
              ),
              undefined
            ),
          ],
          ts.factory.createTypeReferenceNode(
            ts.factory.createIdentifier('TDocument'),
            undefined
          ),
          ts.factory.createBlock(
            [
              ts.factory.createReturnStatement(
                ts.factory.createCallExpression(
                  ts.factory.createIdentifier('serializeXml'),
                  undefined,
                  [
                    ts.factory.createIdentifier('value'),
                    ts.factory.createIdentifier('schema'),
                    ts.factory.createIdentifier('implementation'),
                  ]
                )
              ),
            ],
            true
          )
        ),
      ],
      true
    ),
    sourceFile
  );

  return file;
}
