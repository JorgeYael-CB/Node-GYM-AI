import { Router } from "express";
import { PaymentController } from "./controller";
import { PaymentAdapter, envs } from "../../config";




export const paymentService = new PaymentAdapter(envs.STRIPE_SECRET, envs.STRIPE_SECRET_WEBHOOK);


export class PaymentRoutes{

  static get Router():Router{
    const routes = Router();
    const controller = new PaymentController( paymentService );

    routes.post('/create-session-payment', controller.paymentSession);
    routes.post('/payment-webhook', controller.paymentWebhook);


    return routes;
  }

}
