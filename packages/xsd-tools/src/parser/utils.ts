export function camelCase(key: string) {
  // turn xs:schema into xsSchema
  return key.split(':').map((p, i) => i > 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p).join('');
}
