import { Router } from "express";
import { UsersController } from "./controller";


export class UsersRoutes {

  static get router():Router{
    const routes = Router();
    const controller = new UsersController();

    routes.post('/login-user', controller.loginUser);
    routes.post('/register-user', controller.registerUser);

    return routes;
  }

}
