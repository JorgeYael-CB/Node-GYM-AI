import { envs } from "./config";
import { MongoDb } from "./db/mongo";
import { Routes } from "./presentation/routes";
import { Server } from "./presentation/server";


(()=>{
  main();
})();


async function main() {
  await new MongoDb(envs.MONGO_DB_URI)
    .connect();

  const routes = Routes.router;
  const server = new Server( envs.PORT, routes );

  server.start();
}