import { Router } from 'express';
import { UsersRoutes } from './auth/routes';

export class Routes {

  static get router():Router {
    const routes = Router();

    //* Manejamos las rutas iniciales
    routes.use('/api/auth', UsersRoutes.router);

    return routes;
  }

}