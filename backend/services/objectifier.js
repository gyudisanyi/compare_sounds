
export default function objectifier (array) {
  const obj = {};
  array.forEach(row => obj[row.id] = {...row});
  return obj;
}