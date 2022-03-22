export const mergeMultipleRows = (rows: Array<any>, targets: Array<any>) => {
  let resultAttribute = [];
  for (let row of rows) {
    let tempObj: any = {};
    for (let target of targets) {
      tempObj[target] = row[target];
    }
    resultAttribute.push(tempObj);
  }
  return resultAttribute;
};
