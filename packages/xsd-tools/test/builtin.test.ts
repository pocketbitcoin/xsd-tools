import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { DOMImplementation, DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { parse, serialize, SerializationError, type XsSchema } from '../src/index.js';

const fromString = (xml: string) => new DOMParser().parseFromString(xml, 'text/xml');
const fixture = (name: string) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');

const { xsSchema: schema } = parse(fromString(fixture('builtin.xsd'))) as { xsSchema: XsSchema };
const implementation = new DOMImplementation();

const report = {
  report: {
    title: 'Report',
    total: 12.3,
    code: 'A1',
    tag: ['x', 'y'],
    note: { '#': 'hello', '@lang': 'en' },
    '@authenticate': 'yes',
    '@signed': true,
    '@amount': 1.5,
    '@issued': new Date('2024-02-29'),
    '@revision': 3,
    '@price': 9.9,
  },
};

test('parses built-in and derived types in elements, attributes and simple content', () => {
  assert.deepEqual(parse(fromString(fixture('builtin.xml')), schema), report);
});

test('formats built-in and derived types', () => {
  const xml = new XMLSerializer().serializeToString(serialize(report, schema, implementation));

  // fractionDigits is inherited from Amount by Total
  assert.match(xml, /<total>12.30<\/total>/);
  assert.match(xml, /price="9.90"/);
  assert.match(xml, /signed="true"/);
  assert.match(xml, /issued="2024-02-29"/);
  assert.deepEqual(parse(fromString(xml), schema), report);
});

test('rejects values that do not match their built-in type', () => {
  const withReport = (changes: object) => ({ report: { ...report.report, ...changes } });

  assert.throws(() => serialize(withReport({ '@signed': 'true' }), schema, implementation), SerializationError);
  assert.throws(() => serialize(withReport({ '@revision': 1.5 }), schema, implementation), SerializationError);
  assert.throws(() => serialize(withReport({ title: null }), schema, implementation), SerializationError);
});
