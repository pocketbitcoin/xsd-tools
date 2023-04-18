#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { Command } from 'commander';
import { DOMParser } from '@xmldom/xmldom';
import { generate } from '../generate';
import fetchFile from '../fetch';

const program = new Command();

program
.version(process.env.npm_package_version!)
.command('generate [schema] [output]', { isDefault: true })
.description('generate parser from xml schema (xsd)')
.action(async (schema, output) => {
  const payload = await fetchFile(schema);

  const document = new DOMParser().parseFromString(payload, 'text/xml');

  const contents = generate(document);

  writeFileSync(resolve(output), contents);
});

program.parse(process.argv);
