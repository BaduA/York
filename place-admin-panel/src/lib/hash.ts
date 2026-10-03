function canonical(val: unknown): string {
  if (Array.isArray(val)) return '[' + val.map(canonical).join(',') + ']';
  if (val !== null && typeof val === 'object') {
    const keys = Object.keys(val as object).sort();
    return '{' + keys.map(k => JSON.stringify(k) + ':' + canonical((val as Record<string, unknown>)[k])).join(',') + '}';
  }
  return JSON.stringify(val);
}

export function hashData(data: unknown): string {
  const str = canonical(data);
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (((h << 5) + h) ^ str.charCodeAt(i)) >>> 0;
  }
  return h.toString(16);
}
