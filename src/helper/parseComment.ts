export const parseComment = (commentArr: string[]) => {
  const resultArr = [];
  for (let i = commentArr.length - 1; i >= 0; i--) {
    const comment = commentArr[i];
    const tempArr = comment.split("//");
    const obj: any = {};
    obj.email = tempArr[0];
    obj.avatar = tempArr[1];
    obj.content = tempArr[2];
    resultArr.push(obj);
  }
  return resultArr;
};

// const test = [
//   "khuongduy354@gmail.com//afsdad//this is the third  comment ",
//   "khuongduy354@gmail.com//afsdad//this is the third  comment ",
// ];
// const result = parseComment(test);
