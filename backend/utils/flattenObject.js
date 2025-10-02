// utils/flattenObject.js (or directly in content.js)
function flattenObject(obj, parentKey = '', result = {}) {
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !(obj[key] instanceof File)) {
      flattenObject(obj[key], newKey, result);
    } else {
      result[newKey] = obj[key];
    }
  }
  return result;
}
