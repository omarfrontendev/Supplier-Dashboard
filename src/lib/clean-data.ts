export function cleanAndTrim(obj: any): any {
  if (Array.isArray(obj)) {
    return obj
      .map((item) => cleanAndTrim(item))
      .filter((item) => item !== null && item !== undefined && item !== '');
  }

  if (typeof obj === 'object' && obj !== null) {
    if (obj instanceof Date) return obj;

    const cleanedObj: Record<string, any> = {};

    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

      let value = obj[key];

      // Trim strings
      if (typeof value === 'string') {
        value = value.trim();
      }

      // Recursive clean
      value = cleanAndTrim(value);

      const isEmpty =
        value === '' ||
        value === null ||
        value === undefined ||
        (typeof value === 'object' &&
          !Array.isArray(value) &&
          !(value instanceof Date) && 
          Object.keys(value).length === 0) ||
        (Array.isArray(value) && value.length === 0);

      if (!isEmpty) {
        cleanedObj[key] = value;
      }
    }

    return cleanedObj;
  }

  if (typeof obj === 'string') {
    return obj.trim();
  }

  return obj;
}
