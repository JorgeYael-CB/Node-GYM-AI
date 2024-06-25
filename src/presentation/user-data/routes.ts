import { Router } from "express";
import { UserDataController } from "./controller";


export class UserDataRoutes {

  static get routes():Router{
    const routes = Router();
    const controller = new UserDataController();


    routes.post('/get-training-routine', controller.getTrainingRoutine);


    return routes;
  }

}
