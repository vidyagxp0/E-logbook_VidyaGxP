export const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

export const extractMasterData = (item, fields, nestedPath) => {
  const source = nestedPath ? getNestedValue(item, nestedPath) || {} : item;

  const result = {};
  fields.forEach((field) => {
    result[field.name] = source[field.name] ?? "";
  });

  return result;
};
