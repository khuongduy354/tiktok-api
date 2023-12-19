import { MikroORM } from "@mikro-orm/core";
import type { PostgreSqlDriver } from "@mikro-orm/postgresql"; // or any other driver package

let orm: MikroORM<PostgreSqlDriver>;
MikroORM.init<PostgreSqlDriver>({
  entities: [User, Video],
  dbName: "tiktok-api",
  type: "postgresql",
})
  .then((mikroOrm) => (orm = mikroOrm))
  .catch((err) => console.error(err));

export { orm };
