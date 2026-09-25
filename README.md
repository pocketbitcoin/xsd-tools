<img align="left" alt="xsd tools logo" width="128" src="https://user-images.githubusercontent.com/198988/113477148-43d9bd00-9480-11eb-9587-97a0dcaa0af9.png" />

# `xsd-tools`

> Essentials for schema-driven, type-safe XML processing

## Example

> Check out [/example](/example) for a working example.

```sh
# install the generator and dependencies
pnpm add xsd-tools @xmldom/xmldom@^0.8.15
pnpm add -D @xsd-tools/typescript
```

```sh
# generate types and parser based on xml schema
pnpm xsd-ts example/greeting.xsd example/greeting.ts
```

```ts
// feed xml dom into parser to get the typed valid object structure
import { readFileSync } from 'fs';
import { DOMParser } from '@xmldom/xmldom';
import parse from './greeting.ts';

const xml = readFileSync('example/greeting.xml', 'utf8');

const dom = new DOMParser().parseFromString(xml, 'text/xml');

const { greeting } = parse(dom);

console.log(`${greeting['@from']}: ${greeting['#']}`);
```

## Build

From the repository root, using the pnpm version in `packageManager`:

```sh
pnpm install
pnpm build
```

`pnpm build` compiles `xsd-tools` and `@xsd-tools/typescript` with `tsc`. Each package writes its output to `dist/`.

Publish with pnpm as well. `pnpm publish` rewrites `catalog:` and `workspace:` specifiers to real versions. `npm publish` leaves those protocols in the tarball, and installs then fail.

```sh
pnpm publish-all
```

## License

MIT
