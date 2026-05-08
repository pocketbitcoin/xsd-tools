import { readFileSync } from 'fs';
import { DOMParser } from '@xmldom/xmldom';
import parse from './greeting.js';

const file = new URL('../greeting.xml', import.meta.url);
const xml = readFileSync(file, 'utf8');

const dom = new DOMParser().parseFromString(xml, 'text/xml');

const { greeting } = parse(dom);

console.log(`${greeting['@from']}: ${greeting['#']}`);
