
export default function objectifier (array) {
  const obj = {};
  array.forEach(row => {obj[row.id] = {...row}; delete obj[row.id].id});
  return obj;
}