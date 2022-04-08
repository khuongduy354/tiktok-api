export const mergeRows = (rows: Array<any>, target: any) => {
  if (rows.length < 1) return;
  const mergedRowValues = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row[target]) {
      mergedRowValues.push(row[target]);
    }
  }
  rows[0][target] = mergedRowValues;
  return [rows[0]];
};
