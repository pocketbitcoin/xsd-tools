/* do not edit, but regenerate using xsd-tools */
import { parse } from "xsd-tools";
export type _ = {
    greeting: Greeting;
};
export type Greeting_SimpleType = string;
export type From = string;
export type Greeting = {
    "#": Greeting_SimpleType;
    "@from"?: From;
};
export default function (doc: globalThis.Document) {
    return parse(doc, { "xsElement": [
            { "@name": "greeting", "@type": "Greeting", "@minOccurs": 1, "@maxOccurs": 1 }
        ], "xsComplexType": [
            { "xsSimpleContent": { "xsExtension": { "xsAttribute": [
                            { "@name": "from", "@type": "From" }
                        ], "@base": "Greeting_SimpleType" } }, "@name": "Greeting" }
        ], "xsSimpleType": [
            { "xsRestriction": { "xsEnumeration": [], "xsMinLength": { "@value": 1 }, "xsMaxLength": { "@value": 20 }, "@base": "xs:string" }, "@name": "Greeting_SimpleType" },
            { "xsRestriction": { "xsEnumeration": [], "xsMinLength": { "@value": 1 }, "xsMaxLength": { "@value": 20 }, "@base": "xs:string" }, "@name": "From" }
        ] }) as _;
}
