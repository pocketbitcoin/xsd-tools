import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { DOMParser } from '@xmldom/xmldom';
import { parse, type XsSchema } from '../src/index.js';
import { ValidationError } from '../src/parser/error.js';
import { schema } from './invoice-schema.js';

const fromString = (xml: string) => new DOMParser().parseFromString(xml, 'text/xml');

// builds an invoice document, replacing the children or attributes for a single test
const invoiceXml = ({
  attributes = 'currency="CHF"',
  children = `
    <id> A-1 </id>
    <amount>10.50</amount>
    <count>0</count>
    <paid>false</paid>
    <issued>2024-02-29</issued>
    <created>2024-02-29T12:34:56.789Z</created>
    <line unit="kg">apples</line>
    <line>pears</line>
    <payee><iban>CH00</iban></payee>
  `,
} = {}) => `<?xml version="1.0" encoding="UTF-8"?><invoice ${attributes} xmlns="urn:test">${children}</invoice>`;

test('parses an xsd with the built-in schema', () => {
  const xsd = readFileSync(new URL('../../../example/greeting.xsd', import.meta.url), 'utf8');

  assert.deepEqual(parse(fromString(xsd)), {
    xsSchema: {
      '@targetNamespace': 'example',
      '@elementFormDefault': 'qualified',
      xsElement: [
        { '@name': 'greeting', '@type': 'Greeting', '@minOccurs': 1, '@maxOccurs': 1 },
      ],
      xsComplexType: [{
        '@name': 'Greeting',
        xsSimpleContent: {
          xsExtension: {
            '@base': 'Greeting_SimpleType',
            xsAttribute: [{ '@name': 'from', '@type': 'From', '@use': 'required' }],
          },
        },
      }],
      xsSimpleType: [{
        '@name': 'Greeting_SimpleType',
        xsRestriction: { '@base': 'xs:string', xsEnumeration: [], xsMinLength: { '@value': 1 }, xsMaxLength: { '@value': 20 } },
      }, {
        '@name': 'From',
        xsRestriction: { '@base': 'xs:string', xsEnumeration: [], xsMinLength: { '@value': 1 }, xsMaxLength: { '@value': 20 } },
      }],
    },
  });
});

test('parses values, lists, choices and attributes', () => {
  assert.deepEqual(parse(fromString(invoiceXml()), schema), {
    invoice: {
      id: 'A-1',
      amount: 10.5,
      count: 0,
      paid: false,
      issued: new Date('2024-02-29'),
      created: new Date('2024-02-29T12:34:56.789Z'),
      line: [{ '#': 'apples', '@unit': 'kg' }, { '#': 'pears' }],
      payee: { iban: 'CH00' },
      '@currency': 'CHF',
    },
  });
});

test('parses booleans', () => {
  const paid = (value: string) => (parse(fromString(invoiceXml({
    children: `<id>A-1</id><amount>1</amount><count>1</count><paid>${value}</paid><issued>2024-02-29</issued><created>2024-02-29T00:00:00Z</created><payee><iban>CH00</iban></payee>`,
  })), schema) as any).invoice.paid;

  assert.equal(paid('true'), true);
  assert.equal(paid('1'), true);
  assert.equal(paid('false'), false);
  assert.equal(paid('0'), false);
});

test('includes optional elements when present and returns empty lists when absent', () => {
  const { invoice } = parse(fromString(invoiceXml({
    children: `<note>urgent</note><id>A-1</id><amount>1</amount><count>1</count><paid>true</paid><issued>2024-02-29</issued><created>2024-02-29T00:00:00Z</created><payee><iban>CH00</iban></payee>`,
  })), schema) as any;

  assert.equal(invoice.note, 'urgent');
  assert.deepEqual(invoice.line, []);
});

test('fills in default attribute values', () => {
  const withDefault: XsSchema = {
    xsElement: [{ '@name': 'item', '@type': 'Item', '@minOccurs': 1, '@maxOccurs': 1 }],
    xsComplexType: [{
      '@name': 'Item',
      xsSequence: { xsElement: [] },
      xsAttribute: [
        { '@name': 'status', '@type': 'xs:string', '@default': 'open' },
        { '@name': 'size', '@type': 'xs:integer' },
      ],
      xsAttributeGroup: [],
    }],
    xsSimpleType: [],
  };

  assert.deepEqual(parse(fromString('<item size=" 3 "/>'), withDefault), { item: { '@status': 'open', '@size': 3 } });
  assert.deepEqual(parse(fromString('<item status="closed"/>'), withDefault), { item: { '@status': 'closed' } });
});

test('rejects invalid documents', () => {
  const valid = invoiceXml();
  const rejects = (xml: string, message: RegExp) => assert.throws(() => parse(fromString(xml), schema), (error) => error instanceof ValidationError && message.test(error.message));

  rejects(invoiceXml({ attributes: '' }), /attribute currency is required/);
  rejects(valid.replace('<amount>10.50</amount>', ''), /was expected at least once/);
  rejects(valid.replace('<amount>', '<amount>11</amount><amount>'), /cannot occur multiple times/);
  rejects(valid.replace('<payee><iban>CH00</iban></payee>', '<payee/>'), /none of the root elements matched/);
  rejects(valid.replace('<id> A-1 </id>', '<id></id>'), /was empty/);
});
