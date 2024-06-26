import { Router } from "express";
import { UserDataController } from "./controller";
import { PdfsAdapter } from "../../config";
import { gptServiceAdapter } from "../messages/routes";




const pdfsAdaper = new PdfsAdapter(gptServiceAdapter);


export class UserDataRoutes {

  static get routes():Router{
    const routes = Router();
    const controller = new UserDataController( pdfsAdaper );


    routes.post('/get-training-routine', controller.getTrainingRoutine);


    return routes;
  }

}
