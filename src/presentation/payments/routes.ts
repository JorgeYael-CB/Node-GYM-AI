import { Router } from "express";
import { PaymentController } from "./controller";
import { PaymentAdapter, envs } from "../../config";
import { authMiddleware, usersRepositoryImpl } from "../auth/routes";
import { mailerService } from "../user-data/routes";




export const paymentService = new PaymentAdapter(envs.STRIPE_SECRET, envs.STRIPE_SECRET_WEBHOOK);


export class PaymentRoutes{

  static get Router():Router{
    const routes = Router();
    const controller = new PaymentController( paymentService, usersRepositoryImpl, mailerService );

    routes.post('/create-session-payment', authMiddleware.validateJwt, controller.paymentSession);
    routes.post('/create-session-subscription', authMiddleware.validateJwt, controller.paymentSubscription);
    routes.post('/payment-webhook', controller.paymentWebhook);


    return routes;
  }

}
