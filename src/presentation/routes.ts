import { Router } from 'express';
import { UsersRoutes } from './auth/routes';
import { MessageRoutes } from './messages/routes';
import { UserDataRoutes } from './user-data/routes';
import { PaymentRoutes } from './payments/routes';

export class Routes {

  static get router():Router {
    const routes = Router();


    routes.use('/auth', UsersRoutes.router);
    routes.use('/messages', MessageRoutes.Routes);
    routes.use('/user-data', UserDataRoutes.routes);
    routes.use('/payments', PaymentRoutes.Router);


    return routes;
  }

}