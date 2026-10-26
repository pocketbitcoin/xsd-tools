import { readFileSync } from 'fs';
import { DOMImplementation, DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { parse, serialize } from './greeting.js';

const file = new URL('../greeting.xml', import.meta.url);
const xml = readFileSync(file, 'utf8');

const dom = new DOMParser().parseFromString(xml, 'text/xml');

const { greeting } = parse(dom);

console.log(`${greeting['@from']}: ${greeting['#']}`);

const reply = serialize({
  greeting: {
    '#': 'Hello back!',
    '@from': 'example',
  },
}, new DOMImplementation());

console.log(new XMLSerializer().serializeToString(reply));
