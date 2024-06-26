import { Router } from "express";
import { authMiddleware, usersRepositoryImpl } from "../auth/routes";
import { MessageController } from "./controller";
import { GptServiceAdpater, ShortMessageAdapter } from "../../config";
import { MessageDatasourceMongoImpl } from "../../infrastucture/datasources";
import { MessageRepositoryImpl } from "../../infrastucture/repositories";



const shortMessageAdapter = new ShortMessageAdapter();
export const gptServiceAdapter = new GptServiceAdpater();

const messageDatasourceImpl = new MessageDatasourceMongoImpl();
const messageRepositoryImpl = new MessageRepositoryImpl( messageDatasourceImpl );


export class MessageRoutes {

  static get Routes():Router {
    const routes = Router();
    const controller = new MessageController(shortMessageAdapter, gptServiceAdapter, messageRepositoryImpl, usersRepositoryImpl);


    routes.post('/send-message', authMiddleware.validateJwt, controller.sendMessage);
    routes.get('/get-messages', authMiddleware.validateJwt, controller.getMessages);


    return routes;
  }

}
