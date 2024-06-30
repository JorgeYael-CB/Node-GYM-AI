import Stripe from "stripe";
import { PaymentSessionDto } from "../domain/dtos/payments";
import { Request, Response } from "express";
import { CustomError } from "../domain/errors";


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

      // Colocar aqui el ID de la orden
      payment_intent_data: {
        metadata: {}
      },

      // Items que se van a comprar
      line_items,
      mode: 'payment',
      success_url: 'https://www.youtube.com',
      cancel_url: 'https://www.google.com',
    })


    return session;
  }


  async createSubscriptionSession(){
  }


  async webhook( request:Request, response:Response ){
    const sig = request.headers['stripe-signature'];

    let event;
    if( !sig ) throw CustomError.BadRequestException(`Asignature failed`);

    try {
      event = this.stripe.webhooks.constructEvent(request.body, sig, this.sk_webhook);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        console.log('Alguien pago ', paymentIntentSucceeded);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.send()
  }

}