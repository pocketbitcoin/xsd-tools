import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import { DOMImplementation, DOMParser } from '@xmldom/xmldom';
import { generate } from '../src/generate.js';

const fixture = (name: string) => readFileSync(new URL(`../../xsd-tools/test/fixtures/${name}`, import.meta.url), 'utf8');
const fromString = (xml: string) => new DOMParser().parseFromString(xml, 'text/xml');

// generated next to the package, so that xsd-tools resolves from its node_modules
const outDir = fileURLToPath(new URL('./.generated/', import.meta.url));
const generatedFile = `${outDir}builtin.ts`;
const usageFile = `${outDir}usage.ts`;

mkdirSync(outDir, { recursive: true });
writeFileSync(generatedFile, generate(fromString(fixture('builtin.xsd'))));

// the types must accept the values the parser returns and reject strings in their place
writeFileSync(usageFile, `
import type { Report } from './builtin.js';

export const report: Report = {
  title: 'Report',
  total: 12.3,
  code: 'A1',
  tag: ['x'],
  note: { '#': 'hello', '@lang': 'en' },
  '@authenticate': 'yes',
  '@signed': true,
  '@amount': 1.5,
  '@issued': new Date('2024-02-29'),
  '@revision': 3,
};

// @ts-expect-error xs:boolean attributes are booleans
export const wrong: Report = { ...report, '@signed': 'true' };
`);

test('generates valid typescript for built-in and derived types', () => {
  const program = ts.createProgram([generatedFile, usageFile], {
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    target: ts.ScriptTarget.ESNext,
    lib: ['lib.esnext.d.ts'],
    types: [],
    strict: true,
    exactOptionalPropertyTypes: true,
    noUncheckedIndexedAccess: true,
    verbatimModuleSyntax: true,
    skipLibCheck: true,
    noEmit: true,
  });

  const diagnostics = ts.getPreEmitDiagnostics(program).map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'));

  assert.deepEqual(diagnostics, []);
});

test('generated parse and serialize round-trip a document', async () => {
  const { parse, serialize } = await import(pathToFileURL(generatedFile).href);

  const parsed = parse(fromString(fixture('builtin.xml')));

  assert.equal(parsed.report['@signed'], true);
  assert.equal(parsed.report['@revision'], 3);
  assert.ok(parsed.report['@issued'] instanceof Date);
  assert.deepEqual(parse(serialize(parsed, new DOMImplementation())), parsed);
});
