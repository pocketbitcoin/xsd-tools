<img align="left" alt="xsd tools logo" width="128" src="https://user-images.githubusercontent.com/198988/113477148-43d9bd00-9480-11eb-9587-97a0dcaa0af9.png" />

# `xsd-tools`

> Essentials for schema-driven, type-safe XML processing

`xsd-tools` turns XML documents into plain JavaScript objects and back, guided by an XML schema (XSD). Values are validated against the schema in both directions, including restrictions such as enumerations, patterns, lengths and digit limits.

It has no dependencies and works with any DOM implementation, such as [`@xmldom/xmldom`](https://www.npmjs.com/package/@xmldom/xmldom) in Node or the browser's own DOM.

## Installation

```sh
npm install xsd-tools @xmldom/xmldom
```

Most projects pair it with [`@xsd-tools/typescript`](https://www.npmjs.com/package/@xsd-tools/typescript), which generates TypeScript types plus a typed `parse` and `serialize` from a schema:

```sh
npm install --save-dev @xsd-tools/typescript
npx xsd-ts greeting.xsd src/greeting.ts
```

```ts
import { DOMImplementation, DOMParser } from '@xmldom/xmldom';
import { parse, serialize } from './greeting.js';

const { greeting } = parse(new DOMParser().parseFromString(xml, 'text/xml'));

const document = serialize({ greeting: { '#': 'Hello back!', '@from': 'example' } }, new DOMImplementation());
```

## Usage without code generation

The same functions are available at runtime with a schema you load yourself. Parsing an XSD document without a schema returns the schema itself:

```ts
import { DOMImplementation, DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { parse, serialize, type XsSchema } from 'xsd-tools';

const fromString = (xml: string) => new DOMParser().parseFromString(xml, 'text/xml');

const { xsSchema } = parse(fromString(xsd)) as { xsSchema: XsSchema };

const value = parse(fromString('<greeting xmlns="example" from="me">Hi</greeting>'), xsSchema);
// { greeting: { '@from': 'me', '#': 'Hi' } }

const document = serialize(value, xsSchema, new DOMImplementation());

console.log(new XMLSerializer().serializeToString(document));
```

`serialize` returns a document of the DOM implementation you pass in, for example `document.implementation` in a browser.

## How values are represented

- Elements become properties named after the element. Elements that may occur more than once (`maxOccurs` above 1) become arrays.
- Attributes become properties prefixed with `@`, e.g. `'@from'`.
- The text of an element that also has attributes (`xs:simpleContent`) is stored under `'#'`.
- Built-in types map to JavaScript values:

| XSD type | JavaScript |
| --- | --- |
| `xs:integer`, `xs:int`, `xs:positiveInteger`, … | `number` |
| `xs:decimal`, `xs:float`, `xs:double` | `number` |
| `xs:boolean` | `boolean` |
| `xs:date`, `xs:dateTime` | `Date` |
| all other types (`xs:string`, `xs:token`, `xs:anyURI`, …) | `string` |

When serializing, elements are written in schema order and decimals are padded to their `fractionDigits`, e.g. `1234.5` becomes `1234.50000`.

## Validation

`parse` throws a `ValidationError` and `serialize` throws a `SerializationError` when a value doesn't fit the schema:

- a required element or attribute is missing, or a value has the wrong type
- a restriction on a simple type is violated: `enumeration`, `pattern`, `minLength`, `maxLength`, `totalDigits`, `fractionDigits`, `minInclusive` or `maxInclusive`
- a value is outside the range of its built-in type, e.g. `0` for `xs:positiveInteger` or `256` for `xs:unsignedByte`

```ts
import { SerializationError } from 'xsd-tools';

try {
  serialize({ greeting: { '#': 'x'.repeat(21), '@from': 'me' } }, xsSchema, new DOMImplementation());
} catch (error) {
  if (error instanceof SerializationError) {
    console.error(error.message);
    // expected at most 20 characters, got 21 at /greeting/#
  }
}
```

Decimals are never rounded. A value with more decimal places than `fractionDigits` allows is rejected, so round amounts yourself before serializing.

## Supported schemas

`xsd-tools` supports the subset of XSD used by common message standards such as ISO 20022 (`pain.001`):

- top-level `xs:element`, `xs:complexType` and `xs:simpleType` declarations
- complex types with `xs:sequence`, `xs:choice` or `xs:simpleContent` extensions, plus `xs:attribute`
- simple types restricting a built-in or another named simple type with the restrictions listed above

Other constructs, such as `xs:complexContent`, inline anonymous types, `xs:import`/`xs:include`, lists and unions, are not supported yet.

Two limitations apply:

- Patterns run as JavaScript regular expressions, which covers common patterns but not every XSD-only regex feature.
- Numbers are JavaScript numbers with about 15–17 significant digits, so values beyond that lose precision.

## License

MIT
