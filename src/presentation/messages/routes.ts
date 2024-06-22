import { Router } from "express";
import { authMiddleware } from "../auth/routes";
import { MessageController } from "./controller";
import { GptServiceAdpater, ShortMessageAdapter } from "../../config";



const shortMessageAdapter = new ShortMessageAdapter();
const gptServiceAdapter = new GptServiceAdpater();


export class MessageRoutes {

  static get Routes():Router {
    const routes = Router();
    const controller = new MessageController(shortMessageAdapter, gptServiceAdapter);


    routes.post('/send-message', authMiddleware.validateJwt, controller.sendMessage);
    routes.post('/get-answer-gpt', authMiddleware.validateJwt, controller.getAnswerGpt);


    return routes;
  }

}
