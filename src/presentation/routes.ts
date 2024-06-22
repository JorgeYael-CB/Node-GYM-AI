import { Router } from 'express';
import { UsersRoutes } from './auth/routes';
import { MessageRoutes } from './messages/routes';

export class Routes {

  static get router():Router {
    const routes = Router();


    routes.use('/api/auth', UsersRoutes.router);
    routes.use('/api/messages', MessageRoutes.Routes);


    return routes;
  }

}