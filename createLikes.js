const pgp = require("pg-promise")();

require("dotenv").config();
const db = pgp(process.env.pg_connection_string);

(async () => {
  const colSet = new pgp.helpers.ColumnSet(["user_id", "post_id", "value"], {
    table: "likes",
  });

  const values = [];
  for (let i = 1; i <= +process.env.users_num; i++) {
    const prob = Math.random() * 0.6 + 0.2;
    const mood = Math.random() * 0.3 + 0.2;
    for (let k = 1; k <= 300; k++) {
      if (Math.random() <= prob) {
        let value = true;
        if (Math.random() <= mood) value = false;
        values.push({
          user_id: i,
          post_id: k,
          value,
        });
      }
    }
  }
  const query = pgp.helpers.insert(values, colSet);
  await db.none(query);
  console.log("Likes finished");
  pgp.end();
})();
