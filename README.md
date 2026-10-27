<img align="left" alt="xsd tools logo" width="128" src="https://user-images.githubusercontent.com/198988/113477148-43d9bd00-9480-11eb-9587-97a0dcaa0af9.png" />

# `xsd-tools`

> Essentials for schema-driven, type-safe XML processing

## Example

> Check out [/example](/example) for a working example.

```sh
# install the generator and dependencies
pnpm add xsd-tools @xmldom/xmldom
pnpm add -D @xsd-tools/typescript
```

`xsd-tools` itself has no dependencies. It works with any DOM implementation, such as `@xmldom/xmldom` 0.8 or 0.9 in Node or the browser's own DOM.

```sh
# generate types, parser and serializer from a local xml schema
pnpm xsd-ts example/greeting.xsd example/greeting.ts
```

```ts
// feed xml dom into parser to get the typed valid object structure
import { readFileSync } from 'fs';
import { DOMParser } from '@xmldom/xmldom';
import { parse } from './greeting.ts';

const xml = readFileSync('example/greeting.xml', 'utf8');

const dom = new DOMParser().parseFromString(xml, 'text/xml');

const { greeting } = parse(dom);

console.log(`${greeting['@from']}: ${greeting['#']}`);
```

```ts
// turn a typed object back into an xml dom, using the same generated file
import { DOMImplementation, XMLSerializer } from '@xmldom/xmldom';
import { serialize } from './greeting.ts';

const doc = serialize({
  greeting: {
    '#': 'Hello back!',
    '@from': 'example',
  },
}, new DOMImplementation());

console.log(new XMLSerializer().serializeToString(doc));
// <?xml version="1.0" encoding="UTF-8"?><greeting from="example" xmlns="example">Hello back!</greeting>
```

`serialize` writes elements in schema order and throws a `SerializationError` when a required element or attribute is missing. It returns a document of the DOM implementation you pass in, for example `document.implementation` in a browser.

## Build

From the repository root, using the pnpm version in `packageManager`:

```sh
pnpm install
pnpm build
```

`pnpm build` compiles `xsd-tools` and `@xsd-tools/typescript` with `tsc`. Each package writes its output to `dist/`.

Run the tests with `pnpm test`.

Publish with pnpm as well. `pnpm publish` rewrites `catalog:` and `workspace:` specifiers to real versions. `npm publish` leaves those protocols in the tarball, and installs then fail.

```sh
pnpm publish-all
```

## License

MIT
