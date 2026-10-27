// The subset of the DOM that xsd-tools uses. Typing only these members, rather than
// the DOM lib or @xmldom/xmldom, lets xmldom 0.8 and 0.9 as well as browser DOMs be
// passed in without xsd-tools depending on any of them. The XMLDom prefix keeps the
// names clear of types declared by schemas, such as Document in camt.053.

export const ELEMENT_NODE = 1;

export interface XMLDomNode {
  readonly nodeType: number;
  readonly firstChild: XMLDomNode | null;
  readonly nextSibling: XMLDomNode | null;
  readonly textContent: string | null;
  appendChild(node: XMLDomNode): unknown;
}

export interface XMLDomElement extends XMLDomNode {
  readonly tagName: string;
  readonly namespaceURI: string | null;
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string): void;
  setAttributeNS(namespace: string | null, name: string, value: string): void;
}

export interface XMLDomDocument extends XMLDomNode {
  readonly documentElement: XMLDomElement | null;
  createElementNS(namespace: string | null, qualifiedName: string): XMLDomElement;
  createTextNode(data: string): XMLDomNode;
  createProcessingInstruction(target: string, data: string): XMLDomNode;
  insertBefore(node: XMLDomNode, child: XMLDomNode | null): unknown;
}

// new DOMImplementation() from @xmldom/xmldom, or document.implementation in a browser
export interface XMLDomImplementation<D extends XMLDomDocument = XMLDomDocument> {
  createDocument(namespace: string | null, qualifiedName: string, doctype: null): D;
}
