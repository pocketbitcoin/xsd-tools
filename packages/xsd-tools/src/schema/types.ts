export type XsElement = {
  '@name': string,
  '@type': string,
  '@maxOccurs': number | 'unbounded',
  '@minOccurs': number,
};

export type XsSequence = {
  xsElement: XsElement[],
  xsAny?: XsAny,
};

export type XsChoice = {
  xsElement: XsElement[],
} | {
  xsSequence: XsSequence[],
};

export type XsAttribute = {
  '@name': string,
  '@type': string,
  '@use'?: 'optional' | 'prohibited' | 'required',
  '@default'?: string,
};

export type XsAttributeGroup = {
};

export type XsAnyAttribute = {
};

export type XsAny = {
  '@minOccurs'?: number,
  '@maxOccurs'?: number,
};

export type XsExtension = {
  '@base': string,
  xsAttribute: XsAttribute[],
};

export type XsSimpleContent = {
  xsExtension: XsExtension,
};

export type XsComplexContent = {
};

export type XsComplexType = {
  '@name'?: string,
} & (({
  xsSimpleContent: XsSimpleContent,
} | {
  xsComplexContent: XsComplexContent,
} | ({
  // none
} | {
  xsSequence: XsSequence,
} | {
  xsChoice: XsChoice,
}) & ({
  xsAttribute: XsAttribute[],
  xsAttributeGroup: XsAttributeGroup[],
  xsAnyAttribute?: XsAnyAttribute,
})));

export type XsEnumeration = {
  '@value': string,
};

export type XsFractionDigits = {
  '@value': number,
};

export type XsTotalDigits = {
  '@value': number,
};

export type XsMinInclusive = {
  '@value': number,
};

export type XsPattern = {
  '@value': string,
};

export type XsMinLength = {
  '@value': number,
};

export type XsMaxLength = {
  '@value': number,
};

export type XsRestriction = {
  '@base': string,
  xsEnumeration?: XsEnumeration[],
  xsFractionDigits?: XsFractionDigits,
  xsTotalDigits?: XsTotalDigits,
  xsMinInclusive?: XsMinInclusive,
  xsPattern?: XsPattern,
  xsMinLength?: XsMinLength,
  xsMaxLength?: XsMaxLength,
};

export type XsSimpleType = {
  '@name'?: string,
  xsRestriction: XsRestriction,
};

export type XsSchema = {
  xsElement: XsElement[],
  xsComplexType: XsComplexType[],
  xsSimpleType: XsSimpleType[],
};
