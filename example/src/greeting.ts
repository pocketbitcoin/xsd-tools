/* do not edit, but regenerate using xsd-tools */
import { parse as parseXml, serialize as serializeXml, type XMLDomDocument, type XMLDomImplementation, type XsSchema } from "xsd-tools";
export type _ = {
    greeting: Greeting;
};
export type Greeting_SimpleType = string;
export type From = string;
export type Greeting = {
    "#": Greeting_SimpleType;
    "@from": From;
};
const schema: XsSchema = { "xsElement": [
        { "@name": "greeting", "@type": "Greeting", "@minOccurs": 1, "@maxOccurs": 1 }
    ], "xsComplexType": [
        { "xsSimpleContent": { "xsExtension": { "xsAttribute": [
                        { "@name": "from", "@type": "From", "@use": "required" }
                    ], "@base": "Greeting_SimpleType" } }, "@name": "Greeting" }
    ], "xsSimpleType": [
        { "xsRestriction": { "xsEnumeration": [], "xsMinLength": { "@value": 1 }, "xsMaxLength": { "@value": 20 }, "@base": "xs:string" }, "@name": "Greeting_SimpleType" },
        { "xsRestriction": { "xsEnumeration": [], "xsMinLength": { "@value": 1 }, "xsMaxLength": { "@value": 20 }, "@base": "xs:string" }, "@name": "From" }
    ], "@targetNamespace": "example", "@elementFormDefault": "qualified" };
export function parse(doc: XMLDomDocument) {
    return parseXml(doc, schema) as _;
}
export default parse;
export function serialize(value: _, implementation: XMLDomImplementation): XMLDomDocument {
    return serializeXml(value, schema, implementation);
}
