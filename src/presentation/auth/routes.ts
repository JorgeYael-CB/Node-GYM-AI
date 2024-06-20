import { Router } from "express";
import { UsersController } from "./controller";
import { UsersRepositoryImpl } from "../../infrastucture/repositories";
import { UsersDatasourceMongoImpl } from "../../infrastucture/datasources";
import { BcryptAdapter, JwtAdapter, envs } from "../../config";



const bcryptAdapter = new BcryptAdapter();
const jwtAdapter = new JwtAdapter(envs.JWT_SEED);

const usersDatasourceMongo = new UsersDatasourceMongoImpl(bcryptAdapter);
export const usersRepositoryImpl = new UsersRepositoryImpl(usersDatasourceMongo);


export class UsersRoutes {

  static get router():Router{
    const routes = Router();
    const controller = new UsersController(jwtAdapter, usersRepositoryImpl);

    routes.post('/login-user', controller.loginUser);
    routes.post('/register-user', controller.registerUser);

    return routes;
  }

}
