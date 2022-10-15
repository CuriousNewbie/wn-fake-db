require("dotenv").config();
const users_num = +process.env.users_num;
const avatarUrl = "https://robohash.org/";
const randomInts = require("./helpers/randomInts");
const { faker } = require("@faker-js/faker");
const { createHash } = require("crypto");
const pgp = require("pg-promise")();
const db = pgp(process.env.pg_connection_string);

const bunchObjects = (n, objFactory) => {
  return Array.from(Array(n), (i, j) => objFactory());
};

const subsString = (n, rand, id) => {
  const arr = Array.from(Array(n), (el) => rand()).filter((el) => el !== id);
  return "[" + arr.join(",") + "]";
};
let id = 1;
const createUser = () => {
  const rand = randomInts(1, users_num);
  const subsNum = Math.ceil(Math.random() * users_num * 0.4);
  const blocksNum = Math.ceil(Math.random() * users_num * 0.4);

  const name = faker.name.firstName();
  const lastName = faker.name.lastName();

  const logName = name.slice(0, 4) + lastName.slice(0, 4);
  const email = logName + "@example.com";
  const password = logName + "User";
  let data = {
    id,
    name: logName,
    password: createHash("sha256").update(password).digest("hex"),
    avatar: avatarUrl + logName,
    email,
    subs: subsString(subsNum, rand, id),
    blocks: subsString(blocksNum, rand, id),
  };
  id++;
  return data;
};

const colSet = new pgp.helpers.ColumnSet(
  ["id", "name", "password", "avatar", "email", "subs", "blocks"],
  {
    table: "users",
  }
);

const values = bunchObjects(users_num, createUser);
(async () => {
  const query = pgp.helpers.insert(values, colSet);
  await db.none(query);
  console.log("Users finished " + users_num);
})();

pgp.end();
