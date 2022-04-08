const bcrypt = require("bcrypt");
const password = "1234567891Duy";
bcrypt.hash(password, 1, (err, hash) => {
  console.log(hash);
  bcrypt.compare(password, hash, (err, result) => {
    console.log(result);
  });
});
