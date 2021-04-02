<img align="left" alt="xsd tools logo" width="128" src="https://user-images.githubusercontent.com/198988/113361967-8b136100-934d-11eb-8da0-58c96c900099.png" />

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
