import Stripe from "stripe";
import { PaymentSessionDto } from "../domain/dtos/payments";
import { Request, Response } from "express";
import { CustomError } from "../domain/errors";
import { PaymentSubscriptionDto } from '../domain/dtos/payments';



interface Webhook {
  userId?: string;
  orderId?: string;
  productId?: any;
  subscription?: boolean;
}


export class PaymentAdapter {

  private readonly stripe: Stripe;
  private readonly success_url = 'https://www.youtube.com';
  private readonly cancel_url = 'https://www.google.com';


  constructor(
    sk_key: string,
    private readonly sk_webhook: string,
  ){
    this.stripe = new Stripe( sk_key );
  }


  createPaymentSession = async ( paymentSessionDto: PaymentSessionDto ) => {
    const { currency, products } = paymentSessionDto;
    const line_items = products.map( product => (
      {
        price_data: {
          currency,
          product_data: {
            name: product.name,
            images: product.images,
          },
          unit_amount: Math.round( product.amount * 100 ),
        },
        quantity: product.quantity,
      }
    ));

    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          userId: paymentSessionDto.userId,
          orderId: paymentSessionDto.orderId,
        }
      },
      line_items,
      mode: 'payment',
      allow_promotion_codes: true,
      ui_mode: 'hosted',
      success_url: this.success_url,
      cancel_url: this.cancel_url,
    });

    return session;
  }


  async createSubscriptionSession( paymentSubscriptionDto: PaymentSubscriptionDto ){
    const session = await this.stripe.checkout.sessions.create({
      subscription_data: {
        description: 'SPORT AI',
        metadata: {
          userId: paymentSubscriptionDto.userId,
          orderId: paymentSubscriptionDto.productId,
        },
      },
      line_items: [
        {
          price: paymentSubscriptionDto.productId,
          quantity: 1,
        }
      ],
      mode: 'subscription',
      success_url: this.success_url,
      cancel_url: this.cancel_url,
    });

    return session;
  }


  async webhook( request:Request, response:Response ):Promise<Webhook>{
    const sig = request.headers['stripe-signature'];
    let metaData:Webhook = {};

    let event;
    if( !sig ) throw CustomError.BadRequestException(`Asignature failed`);

    try {
      event = this.stripe.webhooks.constructEvent(request.body, sig, this.sk_webhook);
    } catch (err) {
      throw CustomError.InternalServerError(`Error webhook: ${err}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        metaData = {
          userId: paymentIntentSucceeded.metadata.userId,
          orderId: paymentIntentSucceeded.metadata.orderId,
        };
        break;
      case 'customer.subscription.created': // cuando el usuario hace una suscripcion
        const invoicePaymentSucceeded = event.data.object;
        metaData = {
          userId: invoicePaymentSucceeded.metadata!.userId,
          productId: invoicePaymentSucceeded.metadata!.orderId,
          subscription: true,
        };
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.send();
    return metaData;
  }

}