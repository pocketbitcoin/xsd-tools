import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DOMImplementation, DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { checkLexical, parse, splitTimezone, serialize, SerializationError, ValidationError, type BuiltinKind, type XsSchema } from '../src/index.js';

const fromString = (xml: string) => new DOMParser().parseFromString(xml, 'text/xml');
const implementation = new DOMImplementation();

const accepts = (kind: BuiltinKind, values: string[]) => {
  for (const value of values) {
    assert.equal(checkLexical(value, kind), undefined, `${kind} should accept ${value}`);
  }
};

const rejects = (kind: BuiltinKind, values: string[]) => {
  for (const value of values) {
    assert.notEqual(checkLexical(value, kind), undefined, `${kind} should reject ${value}`);
  }
};

test('checks the lexical space of integers', () => {
  accepts('integer', ['0', '-1', '+1', '007', '123456789012345678901234567890']);
  rejects('integer', ['', '12abc', '1.9', '1.', '1e3', 'abc', '1 000', '--1', '+', '0x10', 'Infinity']);
});

test('checks the lexical space of decimals', () => {
  accepts('decimal', ['0', '-1.50', '+.5', '5.', '0001.1000']);
  rejects('decimal', ['', '1.5x', '.', '1e3', 'INF', 'NaN', '1,5', '- 1']);
});

test('checks the lexical space of floats and doubles', () => {
  accepts('float', ['1', '-1.5', '1e3', '1.5E-10', '.5e+2', 'INF', '-INF', '+INF', 'NaN']);
  rejects('float', ['', 'e3', '1e', 'inf', 'Infinity', '-NaN', '1.5x']);
});

test('checks the lexical space of booleans', () => {
  accepts('boolean', ['true', 'false', '1', '0']);
  rejects('boolean', ['', 'yes', 'no', 'TRUE', 'True', '2', '01']);
});

test('checks the lexical space of dates, including the calendar', () => {
  accepts('date', [
    '2024-01-01', '2024-02-29', '2000-02-29', '2023-12-31', '0000-02-29', '-0001-01-01', '12024-01-01',
    '2024-01-01Z', '2024-01-01+01:00', '2024-01-01-05:30', '2024-01-01+14:00', '2024-01-01-14:00',
  ]);
  rejects('date', [
    '', '2024-02-30', '2023-02-29', '1900-02-29', '2024-04-31', '2024-13-01', '2024-00-10', '2024-01-00',
    '24-01-01', '02024-01-01', '2024-1-1', '2024-01-01T00:00:00', '2024-01-01+14:01', '2024-01-01+15:00',
    '2024-01-01+1:00', '2024-01-01 +01:00', '2024/01/01',
  ]);
});

test('checks the lexical space of date times, including the calendar', () => {
  accepts('dateTime', [
    '2024-02-29T12:34:56', '2024-02-29T12:34:56.789Z', '2024-02-29T23:59:59.123456789+01:00',
    '2024-02-29T24:00:00', '2024-02-29T24:00:00.000Z',
  ]);
  rejects('dateTime', [
    '', '2024-02-30T00:00:00', '2024-02-29', '2024-02-29T12:34', '2024-02-29T25:00:00', '2024-02-29T24:00:01',
    '2024-02-29T12:60:00', '2024-02-29T12:00:60', '2024-02-29 12:00:00', '2024-02-29T12:00:00.', '2024-02-29T12:00:00+01',
  ]);
});

test('checks the lexical space of times', () => {
  accepts('time', ['00:00:00', '23:59:59.999', '12:34:56Z', '12:34:56+01:00', '24:00:00']);
  rejects('time', ['', '12:34', '25:00:00', '24:00:01', '12:34:56.', '2024-01-01T12:34:56', '12:34:56+15:00']);
});

test('splits the timezone from dates and times', () => {
  assert.deepEqual(splitTimezone('2024-01-01'), { value: '2024-01-01' });
  assert.deepEqual(splitTimezone('-0001-01-01-05:00'), { value: '-0001-01-01', tz: '-05:00' });
  assert.deepEqual(splitTimezone('12:34:56Z'), { value: '12:34:56', tz: 'Z' });
  assert.deepEqual(splitTimezone('2024-01-01T12:34:56.5+14:00'), { value: '2024-01-01T12:34:56.5', tz: '+14:00' });
});

// the reproduction from https://github.com/pocketbitcoin/xsd-tools/issues/24
const { xsSchema } = parse(fromString(`<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:simpleType name="Count"><xs:restriction base="xs:integer"><xs:minInclusive value="1"/></xs:restriction></xs:simpleType>
  <xs:simpleType name="Amount"><xs:restriction base="xs:decimal"><xs:minInclusive value="0"/><xs:fractionDigits value="2"/></xs:restriction></xs:simpleType>
  <xs:simpleType name="Flag"><xs:restriction base="xs:boolean"/></xs:simpleType>
  <xs:simpleType name="Day"><xs:restriction base="xs:date"/></xs:simpleType>
  <xs:simpleType name="Clock"><xs:restriction base="xs:time"/></xs:simpleType>
  <xs:simpleType name="Ratio"><xs:restriction base="xs:double"><xs:minInclusive value="0"/></xs:restriction></xs:simpleType>
  <xs:element name="Doc" type="DocType"/>
  <xs:complexType name="DocType">
    <xs:sequence>
      <xs:element name="Cnt" type="Count"/>
      <xs:element name="Amt" type="Amount"/>
      <xs:element name="Ok" type="Flag"/>
      <xs:element name="Day" type="Day"/>
      <xs:element name="Ratio" type="Ratio"/>
      <xs:element name="Time" type="Clock"/>
      <xs:element name="Stamp" type="xs:dateTime"/>
    </xs:sequence>
  </xs:complexType>
</xs:schema>`)) as { xsSchema: XsSchema };

const docXml = ({ cnt = '1', amt = '1.50', ok = 'true', day = '2024-01-01', ratio = '0.5', time = '12:00:00', stamp = '2024-01-01T12:00:00Z' } = {}) =>
  `<Doc><Cnt>${cnt}</Cnt><Amt>${amt}</Amt><Ok>${ok}</Ok><Day>${day}</Day><Ratio>${ratio}</Ratio><Time>${time}</Time><Stamp>${stamp}</Stamp></Doc>`;
const parseDoc = (values: Parameters<typeof docXml>[0]) => (parse(fromString(docXml(values)), xsSchema) as any).Doc;

test('rejects invalid lexical forms when parsing', () => {
  const invalid = (values: Parameters<typeof docXml>[0]) => assert.throws(() => parseDoc(values), ValidationError, JSON.stringify(values));

  invalid({ cnt: '12abc' });
  invalid({ cnt: '1.9' });
  invalid({ cnt: '1e3' });
  invalid({ cnt: 'abc' });
  invalid({ amt: '1.5x' });
  invalid({ ok: 'yes' });
  invalid({ day: '2024-02-30' });
  invalid({ ratio: 'NaN' });
  invalid({ ratio: '-INF' });
  invalid({ time: '25:00:00' });
  invalid({ stamp: '2024-01-01' });
});

test('parses valid lexical forms', () => {
  assert.deepEqual(parseDoc({ cnt: ' +12 ', amt: '.5', ok: '0', day: '2024-01-01+01:00', ratio: '1.5e3', time: '23:59:59.5', stamp: '2024-01-01T12:00:00-05:30' }), {
    Cnt: 12,
    Amt: 0.5,
    Ok: false,
    Day: { date: '2024-01-01', tz: '+01:00' },
    Ratio: 1500,
    Time: { time: '23:59:59.5' },
    Stamp: { dateTime: '2024-01-01T12:00:00', tz: '-05:30' },
  });
  assert.equal(parseDoc({ ratio: 'INF' }).Ratio, Infinity);
});

test('round-trips dates and times with and without timezones unchanged', () => {
  for (const tz of ['', 'Z', '+01:00', '-14:00']) {
    const values = { day: `2024-01-01${tz}`, time: `12:34:56.789${tz}`, stamp: `2024-01-01T12:34:56${tz}` };
    const parsed = parse(fromString(docXml(values)), xsSchema);
    const xml = new XMLSerializer().serializeToString(serialize(parsed, xsSchema, implementation));

    assert.ok(xml.includes(`<Day>${values.day}</Day><Ratio>0.5</Ratio><Time>${values.time}</Time><Stamp>${values.stamp}</Stamp>`), xml);
    assert.deepEqual(parse(fromString(xml), xsSchema), parsed);
  }
});

test('rejects invalid dates and times when serializing', () => {
  const doc = parseDoc({});
  const invalid = (changes: object) => assert.throws(() => serialize({ Doc: { ...doc, ...changes } }, xsSchema, implementation), SerializationError, JSON.stringify(changes));

  invalid({ Day: { date: '2024-02-30' } });
  invalid({ Day: { date: '2024-01-01', tz: '+1' } });
  invalid({ Day: { date: '2024-01-01', tz: 1 } });
  invalid({ Day: { date: '2024-01-01+01:00' } });
  invalid({ Day: { date: '2024-01-01T00:00:00', tz: 'Z' } });
  invalid({ Day: { dateTime: '2024-01-01' } });
  invalid({ Day: '2024-01-01' });
  invalid({ Day: new Date('2024-01-01') });
  invalid({ Time: { time: '24:00:01' } });
  invalid({ Stamp: { dateTime: '2024-01-01T12:00:00Z' } });
  invalid({ Stamp: { date: '2024-01-01', tz: 'Z' } });
  invalid({ Ratio: -1 });
  invalid({ Ratio: NaN });
});

test('formats special float values', () => {
  const floats: XsSchema = {
    xsElement: [{ '@name': 'value', '@type': 'xs:double', '@minOccurs': 1, '@maxOccurs': 1 }],
    xsComplexType: [],
    xsSimpleType: [],
  };
  const format = (value: number) => new XMLSerializer().serializeToString(serialize({ value }, floats, implementation));

  assert.match(format(Infinity), /<value>INF<\/value>/);
  assert.match(format(-Infinity), /<value>-INF<\/value>/);
  assert.match(format(NaN), /<value>NaN<\/value>/);
  assert.match(format(1e-7), /<value>0.0000001<\/value>/);
  assert.ok(Number.isNaN((parse(fromString('<value>NaN</value>'), floats) as any).value));
});
