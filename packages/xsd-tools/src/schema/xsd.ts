import { XsSchema } from '.';

export const schema: XsSchema = {
  xsElement: [{
    '@name': 'xs:schema',
    '@type': 'xs:schema',
    '@minOccurs': 1,
    '@maxOccurs': 1,
  }],
  xsComplexType: [{
    '@name': 'xs:schema',
    xsSequence: {
      xsElement: [{
        '@name': 'xs:element',
        '@type': 'xs:element',
        '@minOccurs': 0,
        '@maxOccurs': 'unbounded',
      }, {
        '@name': 'xs:complexType',
        '@type': 'xs:complexType',
        '@minOccurs': 0,
        '@maxOccurs': 'unbounded',
      }, {
        '@name': 'xs:simpleType',
        '@type': 'xs:simpleType',
        '@minOccurs': 0,
        '@maxOccurs': 'unbounded',
      }],
    },
    xsAttribute: [],
    xsAttributeGroup: [],
  }, {
    '@name': 'xs:element',
    xsSequence: {
      xsElement: [],
    },
    xsAttribute: [{
      '@name': 'name',
      '@type': 'xs:string',
      '@use': 'required',
    }, {
      '@name': 'type',
      '@type': 'xs:string',
      '@use': 'required',
    }, {
      '@name': 'minOccurs',
      '@type': 'xs:nonNegativeInteger',
      '@default': '1',
      '@use': 'required',
    }, {
      '@name': 'maxOccurs',
      '@type': 'xs:nonNegativeIntegerOrUnbounded',
      '@default': '1',
      '@use': 'required',
    }],
    xsAttributeGroup: [],
  }, {
    '@name': 'xs:complexType',
    xsChoice: {
      xsSequence: [{
        xsElement: [{
          '@name': 'xs:simpleContent',
          '@type': 'xs:simpleContent',
          '@minOccurs': 1,
          '@maxOccurs': 1,
        }],
      }, {
        xsElement: [{
          '@name': 'xs:sequence',
          '@type': 'xs:sequence',
          '@minOccurs': 1,
          '@maxOccurs': 1,
        }, {
          '@name': 'xs:attribute',
          '@type': 'xs:attribute',
          '@minOccurs': 0,
          '@maxOccurs': 'unbounded',
        }, {
          '@name': 'xs:attributeGroup',
          '@type': 'xs:attributeGroup',
          '@minOccurs': 0,
          '@maxOccurs': 'unbounded',
        }, {
          '@name': 'xs:anyAttribute',
          '@type': 'xs:anyAttribute',
          '@minOccurs': 0,
          '@maxOccurs': 1,
        }],
      }, {
        xsElement: [{
          '@name': 'xs:choice',
          '@type': 'xs:choice',
          '@minOccurs': 1,
          '@maxOccurs': 1,
        }, {
          '@name': 'xs:attribute',
          '@type': 'xs:attribute',
          '@minOccurs': 0,
          '@maxOccurs': 'unbounded',
        }, {
          '@name': 'xs:attributeGroup',
          '@type': 'xs:attributeGroup',
          '@minOccurs': 0,
          '@maxOccurs': 'unbounded',
        }, {
          '@name': 'xs:anyAttribute',
          '@type': 'xs:anyAttribute',
          '@minOccurs': 0,
          '@maxOccurs': 1,
        }],
      }],
    },
    xsAttribute: [{
      '@name': 'name',
      '@type': 'xs:string',
      '@use': 'required',
    }],
    xsAttributeGroup: [],
  }, {
    '@name': 'xs:attribute',
    xsSequence: {
      xsElement: [{
        '@name': 'xs:simpleType',
        '@type': 'xs:simpleType',
        '@minOccurs': 0,
        '@maxOccurs': 1,
      }],
    },
    xsAttribute: [{
      '@name': 'name',
      '@type': 'xs:string',
      '@use': 'required',
    }, {
      '@name': 'type',
      '@type': 'xs:string',
    }, {
      '@name': 'default',
      '@type': 'xs:string',
    }, {
      '@name': 'fixed',
      '@type': 'xs:string',
    }],
    xsAttributeGroup: [],
  }, {
    '@name': 'xs:extension',
    xsSequence: {
      xsElement: [{
        '@name': 'xs:attribute',
        '@type': 'xs:attribute',
        '@minOccurs': 1,
        '@maxOccurs': 'unbounded',
      }],
    },
    xsAttribute: [{
      '@name': 'base',
      '@type': 'xs:string',
      '@use': 'required',
    }],
    xsAttributeGroup: [],
  }, {
    '@name': 'xs:simpleContent',
    xsSequence: {
      xsElement: [{
        '@name': 'xs:extension',
        '@type': 'xs:extension',
        '@minOccurs': 1,
        '@maxOccurs': 1,
      }],
    },
    xsAttribute: [],
    xsAttributeGroup: [],
  }, {
    '@name': 'xs:simpleType',
    xsSequence: {
      xsElement: [{
        '@name': 'xs:restriction',
        '@type': 'xs:restriction',
        '@minOccurs': 1,
        '@maxOccurs': 1,
      }],
    },
    xsAttribute: [{
      '@name': 'name',
      '@type': 'xs:string',
      '@use': 'required',
    }],
    xsAttributeGroup: [],
  }, {
    '@name': 'xs:any',
    xsSequence: {
      xsElement: [],
    },
    xsAttribute: [],
    xsAttributeGroup: [],
  }, {
    '@name': 'xs:sequence',
    xsSequence: {
      xsElement: [{
        '@name': 'xs:element',
        '@type': 'xs:element',
        '@minOccurs': 1,
        '@maxOccurs': 'unbounded',
      }, {
        '@name': 'xs:any',
        '@type': 'xs:any',
        '@minOccurs': 0,
        '@maxOccurs': 1,
      }],
    },
    xsAttribute: [],
    xsAttributeGroup: [],
  }, {
    '@name': 'xs:choice',
    xsSequence: {
      xsElement: [{
        '@name': 'xs:element',
        '@type': 'xs:element',
        '@minOccurs': 1,
        '@maxOccurs': 'unbounded',
      }],
    },
    xsAttribute: [],
    xsAttributeGroup: [],
  }, {
    '@name': 'xs:restriction',
    xsSequence: {
      xsElement: [{
        '@name': 'xs:enumeration',
        '@type': 'xs:enumeration',
        '@minOccurs': 0,
        '@maxOccurs': 'unbounded',
      }, {
        '@name': 'xs:fractionDigits',
        '@type': 'xs:fractionDigits',
        '@minOccurs': 0,
        '@maxOccurs': 1,
      }, {
        '@name': 'xs:totalDigits',
        '@type': 'xs:totalDigits',
        '@minOccurs': 0,
        '@maxOccurs': 1,
      }, {
        '@name': 'xs:minInclusive',
        '@type': 'xs:minInclusive',
        '@minOccurs': 0,
        '@maxOccurs': 1,
      }, {
        '@name': 'xs:pattern',
        '@type': 'xs:pattern',
        '@minOccurs': 0,
        '@maxOccurs': 1,
      }, {
        '@name': 'xs:minLength',
        '@type': 'xs:minLength',
        '@minOccurs': 0,
        '@maxOccurs': 1,
      }, {
        '@name': 'xs:maxLength',
        '@type': 'xs:maxLength',
        '@minOccurs': 0,
        '@maxOccurs': 1,
      }],
    },
    xsAttribute: [{
      '@name': 'base',
      '@type': 'xs:string',
      '@use': 'required',
    }],
    xsAttributeGroup: [],
  }, {
    '@name': 'xs:enumeration',
    xsSequence: {
      xsElement: [],
    },
    xsAttribute: [{
      '@name': 'value',
      '@type': 'xs:string',
      '@use': 'required',
    }],
    xsAttributeGroup: [],
  }, {
    '@name': 'xs:fractionDigits',
    xsSequence: {
      xsElement: [],
    },
    xsAttribute: [{
      '@name': 'value',
      '@type': 'xs:integer',
      '@use': 'required',
    }],
    xsAttributeGroup: [],
  }, {
    '@name': 'xs:totalDigits',
    xsSequence: {
      xsElement: [],
    },
    xsAttribute: [{
      '@name': 'value',
      '@type': 'xs:integer',
      '@use': 'required',
    }],
    xsAttributeGroup: [],
  }, {
    '@name': 'xs:minInclusive',
    xsSequence: {
      xsElement: [],
    },
    xsAttribute: [{
      '@name': 'value',
      '@type': 'xs:integer',
      '@use': 'required',
    }],
    xsAttributeGroup: [],
  }, {
    '@name': 'xs:pattern',
    xsSequence: {
      xsElement: [],
    },
    xsAttribute: [{
      '@name': 'value',
      '@type': 'xs:string',
      '@use': 'required',
    }],
    xsAttributeGroup: [],
  }, {
    '@name': 'xs:minLength',
    xsSequence: {
      xsElement: [],
    },
    xsAttribute: [{
      '@name': 'value',
      '@type': 'xs:integer',
      '@use': 'required',
    }],
    xsAttributeGroup: [],
  }, {
    '@name': 'xs:maxLength',
    xsSequence: {
      xsElement: [],
    },
    xsAttribute: [{
      '@name': 'value',
      '@type': 'xs:integer',
      '@use': 'required',
    }],
    xsAttributeGroup: [],
  }],
  xsSimpleType: [],
};
