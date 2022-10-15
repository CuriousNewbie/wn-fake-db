require("dotenv").config();
const users_num = +process.env.users_num;
const posts_num = +process.env.posts_num;
const { faker } = require("@faker-js/faker");
const randomInts = require("./helpers/randomInts");
const pgp = require("pg-promise")();
const db = pgp(process.env.pg_connection_string);

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const createFirstComments = async () => {
  const data = await db.query("select id, date from posts;");
  const colSet = new pgp.helpers.ColumnSet(
    ["author_id", "post_id", "date", "content"],
    {
      table: "comments",
    }
  );
  const values = [];
  for (let i = 1; i <= users_num; i++) {
    let maxComments = Math.ceil(Math.random() * 200) + 100;
    let rand = randomInts(1, posts_num);
    for (let k = 0; k < maxComments; k++) {
      const post = data[rand() - 1];
      const postDate = post.date;
      const dateDiff = Date.now() - postDate;
      const date = new Date(+postDate + Math.floor(Math.random() * dateDiff));

      values.push({
        author_id: i,
        post_id: post.id,
        date,
        content: faker.lorem.sentence(),
      });
    }
  }
  const query =
    pgp.helpers.insert(values, colSet) + "returning id,date,post_id;";
  const res = await db.any(query);
  return res;
};

const createNestedComments = async (data, num) => {
  const colSet = new pgp.helpers.ColumnSet(
    ["author_id", "post_id", "date", "content", "parent_comment_id"],
    {
      table: "comments",
    }
  );
  const values = [];
  for (let i = 1; i <= users_num; i++) {
    let maxComments = Math.ceil(Math.random() * num) + 50;
    let randCommentIndexGenerator = randomInts(1, data.length);
    for (let k = 0; k < maxComments; k++) {
      const comment = data[randCommentIndexGenerator() - 1];
      const commentDate = comment.date;
      const dateDiff = Date.now() - commentDate;
      const date = new Date(
        +commentDate + Math.floor(Math.random() * dateDiff)
      );

      values.push({
        author_id: i,
        post_id: comment.post_id,
        parent_comment_id: comment.id,
        date,
        content: faker.lorem.sentence(),
      });
    }
  }
  const query =
    pgp.helpers.insert(values, colSet) + "returning id,date,post_id;";
  const res = await db.any(query);

  return res;
};

(async () => {
  let first = await createFirstComments();
  console.log(`Inserted ${first.length} comments`);
  await delay(1000);

  let sec1 = await createNestedComments(first, 500);
  await delay(1000);

  let sec2 = await createNestedComments(first, 500);
  await delay(1000);

  let sec3 = await createNestedComments(first, 500);
  console.log(
    `Inserted ${sec1.length + sec2.length + sec3.length} comments LVL2`
  );
  await delay(1000);

  let th1 = await createNestedComments(sec1, 500);
  await delay(1000);
  let th2 = await createNestedComments(sec1, 500);
  await delay(1000);
  let th3 = await createNestedComments(sec1, 500);
  await delay(1000);
  let th4 = await createNestedComments(sec1, 500);
  await delay(1000);
  console.log(th1.length);
  let th5 = await createNestedComments(sec2, 500);
  await delay(1000);
  let th6 = await createNestedComments(sec2, 500);
  await delay(1000);
  let th7 = await createNestedComments(sec2, 500);
  await delay(1000);
  let th8 = await createNestedComments(sec2, 500);
  await delay(1000);
  console.log(th5.length);

  let th9 = await createNestedComments(sec3, 500);
  await delay(1000);
  let th10 = await createNestedComments(sec3, 500);
  await delay(1000);
  let th11 = await createNestedComments(sec3, 500);
  await delay(1000);
  let th12 = await createNestedComments(sec3, 500);
  await delay(1000);
  console.log(th9.length);

  let th13 = await createNestedComments(sec1, 500);
  await delay(1000);
  let th14 = await createNestedComments(sec1, 500);
  await delay(1000);
  let th15 = await createNestedComments(sec1, 500);
  await delay(1000);
  let th16 = await createNestedComments(sec1, 500);
  await delay(1000);
  console.log(th13.length);

  let th17 = await createNestedComments(sec2, 500);
  await delay(1000);
  let th18 = await createNestedComments(sec2, 500);
  await delay(1000);
  let th19 = await createNestedComments(sec2, 500);
  await delay(1000);
  let th20 = await createNestedComments(sec2, 500);
  await delay(1000);
  console.log(th17.length);

  let th21 = await createNestedComments(sec3, 500);
  await delay(1000);
  let th22 = await createNestedComments(sec3, 500);
  await delay(1000);
  let th23 = await createNestedComments(sec3, 500);
  await delay(1000);
  let th124 = await createNestedComments(sec3, 500);
  await delay(1000);
  console.log(th21.length);
})();
