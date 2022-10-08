const { faker } = require("@faker-js/faker");

const pgp = require("pg-promise")();

require("dotenv").config();
const db = pgp(process.env.pg_connection_string);

const bunchObjects = (n, objFactory) => {
  return Array.from(Array(n), (i, j) => objFactory());
};

const createPost = () => {
  const author_id = Math.floor(Math.random() * 100) + 1;
  const date = new Date(Date.now() - Math.floor(Math.random() * 2_592_000_000));
  const content = faker.lorem.paragraph(Math.floor(Math.random() * 10) + 5);
  return {
    author_id,
    date,
    content,
  };
};

const postColSet = new pgp.helpers.ColumnSet(["author_id", "date", "content"], {
  table: "posts",
});
const postValues = bunchObjects(300, createPost);
(async () => {
  const query = pgp.helpers.insert(postValues, postColSet);
  await db.none(query);
  console.log("Posts finished");
})();

pgp.end();
