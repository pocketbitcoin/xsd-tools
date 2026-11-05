import type { ResolvedType } from './builtin.js';

const patterns = new Map<string, RegExp>();

// xsd patterns always match the whole value
function compilePattern(pattern: string) {
  let regExp = patterns.get(pattern);

  if (!regExp) {
    regExp = new RegExp(`^(?:${pattern})$`, 'u');
    patterns.set(pattern, regExp);
  }

  return regExp;
}

// leading zeros of the integer part and trailing zeros of the fraction are insignificant
function countDigits(text: string) {
  const [integer = '', fraction = ''] = text.replace(/^[+-]/, '').split('.');
  const integerDigits = integer.replace(/^0+/, '').length;
  const fractionDigits = fraction.replace(/0+$/, '').length;

  return { totalDigits: integerDigits + fractionDigits, fractionDigits };
}

export function checkFacets(text: string, type: ResolvedType): string | undefined {
  if (type.enumeration && !type.enumeration.includes(text)) {
    return `expected one of ${type.enumeration.join(', ')}, got ${text}`;
  }

  for (const pattern of type.patterns ?? []) {
    if (!compilePattern(pattern).test(text)) {
      return `expected to match ${pattern}, got ${text}`;
    }
  }

  const length = [...text].length;

  if (type.minLength !== undefined && length < type.minLength) {
    return `expected at least ${type.minLength} characters, got ${length}`;
  }

  if (type.maxLength !== undefined && length > type.maxLength) {
    return `expected at most ${type.maxLength} characters, got ${length}`;
  }

  if (type.kind !== 'integer' && type.kind !== 'decimal') {
    return undefined;
  }

  const digits = countDigits(text);

  if (type.totalDigits !== undefined && digits.totalDigits > type.totalDigits) {
    return `expected at most ${type.totalDigits} digits, got ${text}`;
  }

  if (type.fractionDigits !== undefined && digits.fractionDigits > type.fractionDigits) {
    return `expected at most ${type.fractionDigits} fraction digits, got ${text}`;
  }

  if (type.minInclusive !== undefined && Number(text) < type.minInclusive) {
    return `expected at least ${type.minInclusive}, got ${text}`;
  }

  if (type.maxInclusive !== undefined && Number(text) > type.maxInclusive) {
    return `expected at most ${type.maxInclusive}, got ${text}`;
  }

  return undefined;
}
