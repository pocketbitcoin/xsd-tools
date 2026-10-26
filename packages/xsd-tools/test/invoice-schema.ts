import type { XsSchema } from '../src/index.js';

// covers every construct the runtime supports
export const schema: XsSchema = {
  '@targetNamespace': 'urn:test',
  '@elementFormDefault': 'qualified',
  xsElement: [
    { '@name': 'invoice', '@type': 'Invoice', '@minOccurs': 1, '@maxOccurs': 1 },
  ],
  xsComplexType: [{
    '@name': 'Invoice',
    xsSequence: {
      xsElement: [
        { '@name': 'id', '@type': 'Text', '@minOccurs': 1, '@maxOccurs': 1 },
        { '@name': 'amount', '@type': 'Amount', '@minOccurs': 1, '@maxOccurs': 1 },
        { '@name': 'count', '@type': 'Count', '@minOccurs': 1, '@maxOccurs': 1 },
        { '@name': 'paid', '@type': 'Flag', '@minOccurs': 1, '@maxOccurs': 1 },
        { '@name': 'issued', '@type': 'Day', '@minOccurs': 1, '@maxOccurs': 1 },
        { '@name': 'created', '@type': 'Stamp', '@minOccurs': 1, '@maxOccurs': 1 },
        { '@name': 'note', '@type': 'Text', '@minOccurs': 0, '@maxOccurs': 1 },
        { '@name': 'line', '@type': 'Line', '@minOccurs': 0, '@maxOccurs': 'unbounded' },
        { '@name': 'payee', '@type': 'Payee', '@minOccurs': 1, '@maxOccurs': 1 },
      ],
    },
    xsAttribute: [
      { '@name': 'currency', '@type': 'Text', '@use': 'required' },
    ],
    xsAttributeGroup: [],
  }, {
    '@name': 'Line',
    xsSimpleContent: {
      xsExtension: {
        '@base': 'Text',
        xsAttribute: [{ '@name': 'unit', '@type': 'Text' }],
      },
    },
  }, {
    '@name': 'Payee',
    xsChoice: {
      xsElement: [
        { '@name': 'iban', '@type': 'Text', '@minOccurs': 1, '@maxOccurs': 1 },
        { '@name': 'address', '@type': 'Text', '@minOccurs': 1, '@maxOccurs': 1 },
      ],
    },
    xsAttribute: [],
    xsAttributeGroup: [],
  }],
  xsSimpleType: [
    { '@name': 'Text', xsRestriction: { '@base': 'xs:string' } },
    { '@name': 'Amount', xsRestriction: { '@base': 'xs:decimal', xsFractionDigits: { '@value': 2 } } },
    { '@name': 'Count', xsRestriction: { '@base': 'xs:integer' } },
    { '@name': 'Flag', xsRestriction: { '@base': 'xs:boolean' } },
    { '@name': 'Day', xsRestriction: { '@base': 'xs:date' } },
    { '@name': 'Stamp', xsRestriction: { '@base': 'xs:dateTime' } },
  ],
};
