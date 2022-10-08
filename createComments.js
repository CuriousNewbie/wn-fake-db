const { faker } = require("@faker-js/faker");

const pgp = require("pg-promise")();

require("dotenv").config();
const db = pgp(process.env.pg_connection_string);

(async () => {
  const data = await db.query("select id, date from posts;");
  const colSet = new pgp.helpers.ColumnSet(
    ["author_id", "post_id", "date", "content"],
    {
      table: "comments",
    }
  );
  const values = [];
  for (let i = 1; i <= 100; i++) {
    let maxComments = Math.ceil(Math.random() * 20) + 5;
    for (let k = 0; k < maxComments; k++) {
      const post_id = Math.ceil(Math.random() * 300);
      const postDate = data[post_id - 1].date;
      const dateDiff = Date.now() - postDate;
      const date = new Date(+postDate + Math.floor(Math.random() * dateDiff));

      values.push({
        author_id: i,
        post_id,
        date,
        content: faker.lorem.sentence(),
      });
    }
  }
  const query = pgp.helpers.insert(values, colSet);
  await db.none(query);
  console.log("Comments finished");
  pgp.end();
})();
