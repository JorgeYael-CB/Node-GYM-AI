import Stripe from "stripe";
import { PaymentSessionDto } from "../domain/dtos/payments";


export class PaymentAdapter {

  private readonly stripe: Stripe;

  constructor(
    sk_key: string,
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


  createSubscriptionSession(){
  }

}