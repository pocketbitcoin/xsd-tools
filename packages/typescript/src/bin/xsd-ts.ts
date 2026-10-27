#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { parseArgs } from 'util';
import { DOMParser } from '@xmldom/xmldom';
import { generate } from '../generate.js';

const usage = `Usage: xsd-ts [generate] <schema> <output>

Generate types, parser and serializer from a local xml schema (xsd).
// npm_package_version is only set inside package scripts, and then belongs to the calling project
const { version } = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));

const program = new Command();

program
.version(version)
.command('generate [schema] [output]', { isDefault: true })
.description('generate parser from xml schema (xsd)')
.action(async (schema, output) => {
  const payload = await fetchFile(schema);

Options:
  -V, --version  output the version number
  -h, --help     display help for command`;

function parse() {
  try {
    return parseArgs({
      allowPositionals: true,
      options: {
        version: { type: 'boolean', short: 'V' },
        help: { type: 'boolean', short: 'h' },
      },
    });
  } catch (error) {
    console.error(`${(error as Error).message}\n\n${usage}`);
    process.exit(1);
  }
}

const { values, positionals } = parse();

if (values.version) {
  // npm_package_version is only set inside package scripts, and then belongs to the calling project
  const { version } = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));

  console.log(version);
  process.exit(0);
}

// `generate` is the only command, so it may be omitted
const [schema, output, ...rest] = positionals[0] === 'generate' ? positionals.slice(1) : positionals;

if (values.help) {
  console.log(usage);
  process.exit(0);
}

if (!schema || !output || rest.length > 0) {
  console.error(usage);
  process.exit(1);
}

const document = new DOMParser().parseFromString(readFileSync(schema, 'utf8'), 'text/xml');

writeFileSync(resolve(output), generate(document));
