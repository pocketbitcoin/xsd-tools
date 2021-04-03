<img align="left" alt="xsd tools logo" width="128" src="https://user-images.githubusercontent.com/198988/113477148-43d9bd00-9480-11eb-9587-97a0dcaa0af9.png" />

# `xsd-tools`

> Essentials for schema-driven, type-safe XML processing

## Example

> Check out [/example](/example) for a working example.

```sh
# install the generator and dependencies
yarn add xsd-tools xmldom
yarn add -D @xsd-tools/typescript
```

```sh
# generate types and parser based on xml schema
yarn run xsd-ts example/greeting.xsd example/greeting.ts
```

```ts
// feed xml dom into parser to get the typed valid object structure
import { readFileSync } from 'fs';
import { DOMParser } from 'xmldom';
import parse from './greeting.ts';

const xml = readFileSync('example/greeting.xml', 'utf8');

const dom = new DOMParser().parseFromString(xml, 'text/xml');

const { greeting } = parse(dom);

console.log(`${greeting['@from']}: ${greeting['#']}`);
```

## License

MIT
