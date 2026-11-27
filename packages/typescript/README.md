<img align="left" alt="xsd tools logo" width="128" src="https://user-images.githubusercontent.com/198988/113477148-43d9bd00-9480-11eb-9587-97a0dcaa0af9.png" />

# `@xsd-tools/typescript`

> Schema-driven XML parser generator for TypeScript

Generates TypeScript types and a typed `parse` and `serialize` from an XML schema (XSD). The generated code uses [`xsd-tools`](https://www.npmjs.com/package/xsd-tools) at runtime, which validates every value against the schema.

## Installation

```sh
npm install xsd-tools @xmldom/xmldom
npm install --save-dev @xsd-tools/typescript
```

## Generating code

```sh
npx xsd-ts greeting.xsd src/greeting.ts
```

```
Usage: xsd-ts [generate] <schema> <output>

Options:
  -V, --version  output the version number
  -h, --help     display help for command
```

Commit the generated file, or add the command as a script and regenerate it whenever the schema changes:

```json
{
  "scripts": {
    "generate": "xsd-ts greeting.xsd src/greeting.ts"
  }
}
```

## The generated file

For this schema:

```xml
<xs:schema xmlns="example" xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified" targetNamespace="example">
  <xs:element name="greeting" type="Greeting"/>
  <xs:complexType name="Greeting">
    <xs:simpleContent>
      <xs:extension base="xs:string">
        <xs:attribute name="from" type="From" use="required"/>
      </xs:extension>
    </xs:simpleContent>
  </xs:complexType>
  <xs:simpleType name="From">
    <xs:restriction base="xs:string">
      <xs:maxLength value="20"/>
    </xs:restriction>
  </xs:simpleType>
</xs:schema>
```

the generated file contains:

- a type for every named simple and complex type, e.g. `Greeting` and `From`. Enumerations become unions of string literals such as `'HIGH' | 'NORM'`.
- a type `_` for the document, e.g. `{ greeting: Greeting }`
- `parse(document)`, which turns an XML DOM document into a value of type `_`. It is also the default export.
- `serialize(value, implementation)`, which turns a value of type `_` into a document of the given DOM implementation

```ts
import { DOMImplementation, DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { parse, serialize } from './greeting.js';

const { greeting } = parse(new DOMParser().parseFromString(xml, 'text/xml'));

console.log(`${greeting['@from']}: ${greeting['#']}`);

const reply = serialize({
  greeting: {
    '#': 'Hello back!',
    '@from': 'example',
  },
}, new DOMImplementation());

console.log(new XMLSerializer().serializeToString(reply));
// <?xml version="1.0" encoding="UTF-8"?><greeting from="example" xmlns="example">Hello back!</greeting>
```

`parse` throws a `ValidationError` and `serialize` throws a `SerializationError` when a value doesn't fit the schema, for example when a `maxLength` is exceeded. See [`xsd-tools`](https://www.npmjs.com/package/xsd-tools) for how values are represented, what is validated and which schema features are supported.

## Programmatic use

```ts
import { readFileSync, writeFileSync } from 'node:fs';
import { DOMParser } from '@xmldom/xmldom';
import { generate } from '@xsd-tools/typescript';

const schema = new DOMParser().parseFromString(readFileSync('greeting.xsd', 'utf8'), 'text/xml');

writeFileSync('src/greeting.ts', generate(schema));
```

## License

MIT
