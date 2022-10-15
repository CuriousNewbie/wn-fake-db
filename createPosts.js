const { faker } = require("@faker-js/faker");

const pgp = require("pg-promise")();

require("dotenv").config();
const users_num = +process.env.users_num;
const posts_num = +process.env.posts_num;

const db = pgp(process.env.pg_connection_string);

const bunchObjects = (n, objFactory) => {
  return Array.from(Array(n), (i, j) => objFactory());
};

const createPost = () => {
  const author_id = Math.ceil(Math.random() * users_num);
  const date = new Date(Date.now() - Math.floor(Math.random() * 7_776_000_000));
  const content = faker.lorem.paragraph(Math.floor(Math.random() * 20) + 10);
  return {
    author_id,
    date,
    content,
    title: faker.lorem.sentence(),
  };
};

const postColSet = new pgp.helpers.ColumnSet(
  ["author_id", "date", "content", "title"],
  {
    table: "posts",
  }
);
const postValues = bunchObjects(posts_num, createPost);
(async () => {
  const query = pgp.helpers.insert(postValues, postColSet);
  await db.none(query);
  console.log("Posts finished " + posts_num);
})();

pgp.end();
