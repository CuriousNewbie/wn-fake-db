const { faker } = require("@faker-js/faker");
const { createHash } = require("crypto");
const pgp = require("pg-promise")();

require("dotenv").config();
const db = pgp(process.env.pg_connection_string);

const avatarUrl = "https://robohash.org/";

const bunchObjects = (n, objFactory) => {
  return Array.from(Array(n), (i, j) => objFactory());
};

{
  const createUser = () => {
    const name = faker.name.firstName();
    const lastName = faker.name.lastName();
    const logName = name.slice(0, 3) + lastName.slice(0, 3);
    const password = logName + "User";
    return {
      name: logName,
      password: createHash("sha256").update(password).digest("hex"),
      avatar: avatarUrl + logName,
    };
  };

  const colSet = new pgp.helpers.ColumnSet(["name", "password", "avatar"], {
    table: "users",
  });

  const values = bunchObjects(100, createUser);
  (async () => {
    const query = pgp.helpers.insert(values, colSet);
    await db.none(query);
    console.log("Users finished");
  })();
}

pgp.end();
