import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { DOMImplementation, DOMParser, XMLSerializer, type Node } from '@xmldom/xmldom';
import { parse, serialize, SerializationError, xsdSchema } from '../src/index.js';
import { schema } from './invoice-schema.js';

// object keys deliberately out of schema order
const invoice = {
  invoice: {
    payee: { address: 'Main St <1> & "Co"' },
    line: [{ '#': 'apples', '@unit': 'kg' }, { '#': 'pears' }],
    created: new Date('2024-02-29T12:34:56.789Z'),
    issued: new Date('2024-02-29'),
    paid: false,
    count: 0,
    amount: 10.5,
    id: 'A-1',
    '@currency': 'CHF',
  },
};

const implementation = new DOMImplementation();
const toString = (doc: Node) => new XMLSerializer().serializeToString(doc);
const fromString = (xml: string) => new DOMParser().parseFromString(xml, 'text/xml');

test('writes elements in schema order with formatted values', () => {
  assert.equal(
    toString(serialize(invoice, schema, implementation)),
    '<?xml version="1.0" encoding="UTF-8"?>'
    + '<invoice currency="CHF" xmlns="urn:test">'
    + '<id>A-1</id><amount>10.50</amount><count>0</count><paid>false</paid>'
    + '<issued>2024-02-29</issued><created>2024-02-29T12:34:56.789Z</created>'
    + '<line unit="kg">apples</line><line>pears</line>'
    + '<payee><address>Main St &lt;1&gt; &amp; "Co"</address></payee>'
    + '</invoice>',
  );
});

test('round-trips through parse, as document and as string', () => {
  const doc = serialize(invoice, schema, implementation);
  const expected = { invoice: { ...invoice.invoice, amount: 10.5 } };

  assert.deepEqual(parse(doc, schema), expected);
  assert.deepEqual(parse(fromString(toString(doc)), schema), expected);
});

test('puts local elements in no namespace when unqualified', () => {
  const { '@elementFormDefault': _, ...unqualified } = schema;

  assert.match(toString(serialize(invoice, unqualified, implementation)), /<invoice currency="CHF" xmlns="urn:test"><id xmlns="">/);
});

test('rejects missing required elements and attributes', () => {
  const { id, ...withoutId } = invoice.invoice;
  const { '@currency': currency, ...withoutCurrency } = invoice.invoice;

  assert.throws(() => serialize({ invoice: withoutId }, schema, implementation), SerializationError);
  assert.throws(() => serialize({ invoice: withoutCurrency }, schema, implementation), SerializationError);
  assert.throws(() => serialize({ invoice: { ...invoice.invoice, payee: {} } }, schema, implementation), SerializationError);
  assert.throws(() => serialize({ receipt: invoice.invoice }, schema, implementation), SerializationError);
});

test('round-trips an xsd through the built-in schema', () => {
  const xsd = readFileSync(new URL('../../../example/greeting.xsd', import.meta.url), 'utf8');
  const parsed = parse(fromString(xsd));

  assert.deepEqual(parse(fromString(toString(serialize(parsed, xsdSchema, implementation)))), parsed);
});
