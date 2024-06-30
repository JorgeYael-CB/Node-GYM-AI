import Stripe from "stripe";
import { PaymentSessionDto } from "../domain/dtos/payments";
import { Request, Response } from "express";
import { CustomError } from "../domain/errors";



interface Webhook {
  userId?: string;
}


export class PaymentAdapter {

  private readonly stripe: Stripe;

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
          },
          unit_amount: Math.round( product.amount * 100 ), // 100 pesos mxn
        },
        quantity: product.quantity,
      }
    ));


    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          userId: paymentSessionDto.userId,
        }
      },
      line_items,
      mode: 'payment',
      success_url: 'https://www.youtube.com',
      cancel_url: 'https://www.google.com',
    });

    return session;
  }


  async createSubscriptionSession(){
  }


  async webhook( request:Request, response:Response ):Promise<Webhook>{
    const sig = request.headers['stripe-signature'];
    let metaData = {
      userId: '',
    };

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
        };
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.send()
    return metaData;
  }

}