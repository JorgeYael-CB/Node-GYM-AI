import { Router } from "express";
import { UserDataController } from "./controller";
import { MailerAdapter, PdfsAdapter, envs } from "../../config";
import { gptServiceAdapter } from "../messages/routes";
import { authMiddleware, usersRepositoryImpl } from "../auth/routes";
import { UserDataDatasourceMongoImpl } from "../../infrastucture/datasources";
import { UserDataRepositoryImpl } from "../../infrastucture/repositories/user-data.repository.impl";




const pdfsAdaper = new PdfsAdapter(gptServiceAdapter);
const userDataDatasource = new UserDataDatasourceMongoImpl();
const userDataRepository = new UserDataRepositoryImpl(userDataDatasource);

const mailerService = new MailerAdapter({
  mailerPass: envs.MAILER_PASS,
  mailerUser: envs.MAILER_EMAIL,
});


export class UserDataRoutes {

  static get routes():Router{
    const routes = Router();
    const controller = new UserDataController( pdfsAdaper, usersRepositoryImpl, userDataRepository, mailerService, envs.EMAIL_ADMIN );

    routes.post('/get-training-routine', authMiddleware.validateJwt, controller.getTrainingRoutine);

    return routes;
  }

}
