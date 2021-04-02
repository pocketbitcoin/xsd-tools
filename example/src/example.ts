import { readFileSync } from 'fs';
import { resolve } from 'path';
import { DOMParser } from 'xmldom';
import parse from './greeting';

const xml = readFileSync(resolve(__dirname, '../greeting.xml'), 'utf8');

const dom = new DOMParser().parseFromString(xml, 'text/xml');

const { greeting } = parse(dom);

console.log(`${greeting['@from']}: ${greeting['#']}`);
