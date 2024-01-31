import knex from "knex";
export const kn = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.PGPORT),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },
});

kn.raw("SELECT 1")
  .then(() => {
    console.log("PostgreSQL connected");
  })
  .catch((e) => {
    console.log("PostgreSQL not connected");
    console.error(e);
  });
