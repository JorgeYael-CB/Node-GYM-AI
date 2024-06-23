import { Router } from "express";
import { UsersController } from "./controller";
import { UsersRepositoryImpl } from "../../infrastucture/repositories";
import { UsersDatasourceMongoImpl } from "../../infrastucture/datasources";
import { BcryptAdapter, CompareDateAdapter, JwtAdapter, envs } from "../../config";
import { AuthMiddlweware } from "../middlewares/auth/auth.middleware";



const bcryptAdapter = new BcryptAdapter();
const jwtAdapter = new JwtAdapter(envs.JWT_SEED);
const compareDateAdapter = new CompareDateAdapter();

const usersDatasourceMongo = new UsersDatasourceMongoImpl(bcryptAdapter, compareDateAdapter);
export const usersRepositoryImpl = new UsersRepositoryImpl(usersDatasourceMongo);

export const authMiddleware = new AuthMiddlweware(jwtAdapter, usersRepositoryImpl);


export class UsersRoutes {

  static get router():Router{
    const routes = Router();
    const controller = new UsersController(jwtAdapter, usersRepositoryImpl);

    routes.post('/login-user', controller.loginUser);
    routes.post('/register-user', controller.registerUser);
    routes.post('/validate-token', [authMiddleware.validateJwt], controller.validateJwt);
    routes.get('/get-user', [authMiddleware.validateJwt], controller.getUser);

    return routes;
  }

}
