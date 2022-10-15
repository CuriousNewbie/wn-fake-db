const randomInts = require("../helpers/randomInts");
const rand1_10 = randomInts(1, 100);

for (let i = 0; i < 20; i++) console.log(rand1_10());
