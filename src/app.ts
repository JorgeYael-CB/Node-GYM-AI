import { envs } from "./config";
import { Routes } from "./presentation/routes";
import { Server } from "./presentation/server";


(()=>{
  main();
})();


async function main() {
  const routes = Routes.router;
  const server = new Server( envs.PORT, routes );

  server.start();
}