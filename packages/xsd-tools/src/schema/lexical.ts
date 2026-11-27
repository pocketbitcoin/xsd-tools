import type { BuiltinKind } from './builtin.js';

// lexical spaces of the built-in types, see https://www.w3.org/TR/xmlschema11-2/
const integer = /^[+-]?[0-9]+$/;
const decimal = /^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)$/;
const float = /^(?:[+-]?(?:(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?|INF)|NaN)$/;
const boolean = /^(?:true|false|1|0)$/;

// years have at least four digits and no leading zeros beyond that, timezones range from -14:00 to +14:00
const year = '(-?(?:[1-9][0-9]{3,}|0[0-9]{3}))';
const monthDay = '(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])';
const time = '(?:(?:[01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](?:\\.[0-9]+)?|24:00:00(?:\\.0+)?)';
const timezone = '(?:Z|[+-](?:(?:0[0-9]|1[0-3]):[0-5][0-9]|14:00))';
const date = new RegExp(`^${year}-${monthDay}${timezone}?$`);
const dateTime = new RegExp(`^${year}-${monthDay}T${time}${timezone}?$`);
const timeOfDay = new RegExp(`^${time}${timezone}?$`);
const trailingTimezone = /(?:Z|[+-][0-9]{2}:[0-9]{2})$/;

// splits a date, time or dateTime into its local part and timezone, as returned by the parser
export function splitTimezone(text: string): { value: string, tz?: string } {
  const match = trailingTimezone.exec(text);

  return match ? { value: text.slice(0, match.index), tz: match[0] } : { value: text };
}

// proleptic gregorian calendar, where year 0 (1 BCE) is a leap year
function daysInMonth(year: number, month: number) {
  if (month === 2) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  }

  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function checkCalendar(text: string, pattern: RegExp) {
  const match = pattern.exec(text);

  if (!match) {
    return false;
  }

  const [, year = '', month = '', day = ''] = match;

  return Number(day) <= daysInMonth(Number(year), Number(month));
}

const expected: Record<BuiltinKind, string> = {
  string: 'string',
  integer: 'integer',
  decimal: 'decimal',
  float: 'floating point number',
  boolean: 'boolean (true, false, 1 or 0)',
  date: 'date (YYYY-MM-DD with optional timezone)',
  time: 'time (hh:mm:ss with optional fraction and timezone)',
  dateTime: 'date and time (YYYY-MM-DDThh:mm:ss with optional fraction and timezone)',
};

function isLexical(text: string, kind: BuiltinKind) {
  switch (kind) {
    case 'string':
      return true;
    case 'integer':
      return integer.test(text);
    case 'decimal':
      return decimal.test(text);
    case 'float':
      return float.test(text);
    case 'boolean':
      return boolean.test(text);
    case 'date':
      return checkCalendar(text, date);
    case 'time':
      return timeOfDay.test(text);
    case 'dateTime':
      return checkCalendar(text, dateTime);
  }
}

export function checkLexical(text: string, kind: BuiltinKind): string | undefined {
  return isLexical(text, kind) ? undefined : `expected ${expected[kind]}, got ${text}`;
}

// only meaningful for text that passed checkLexical for a numeric kind
export function toNumber(text: string): number {
  if (text === 'INF' || text === '+INF') {
    return Infinity;
  }

  if (text === '-INF') {
    return -Infinity;
  }

  return Number(text);
}
