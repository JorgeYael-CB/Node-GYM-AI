import Stripe from "stripe";
import { PaymentSessionDto } from "../domain/dtos/payments";
import { Request, Response } from "express";
import { CustomError } from "../domain/errors";
import { PaymentSubscriptionDto } from '../domain/dtos/payments';
import { CallbacksHookInterface } from "../domain/interfaces";



export class PaymentAdapter {

  private readonly stripe: Stripe;
  private readonly success_url = 'http://localhost:5173/dashboard';
  private readonly cancel_url = 'https://www.google.com';


  constructor(
    sk_key: string,
    private readonly sk_webhook: string,
  ){
    this.stripe = new Stripe( sk_key );
  }


  async createCustomer(email: string, name: string) {
    const customer = await this.stripe.customers.create({
      email,
      name,
    });
    return customer;
  }


  createPaymentSession = async ( paymentSessionDto: PaymentSessionDto ) => {
    const { currency, products, email, name } = paymentSessionDto;
    const customer = await this.createCustomer(email, name);

    const line_items = products.map( product => {
      return {
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
    });

    const session = await this.stripe.checkout.sessions.create({
      line_items,
      customer: customer.id,
      payment_intent_data: {
        metadata: {
          userId: paymentSessionDto.userId,
        },
      },
      mode: 'payment',
      allow_promotion_codes: true,
      ui_mode: 'hosted',
      success_url: this.success_url,
      cancel_url: this.cancel_url,
    });

    return session;
  }


  async createSubscriptionSession( paymentSubscriptionDto: PaymentSubscriptionDto ){
    const customer = await this.createCustomer( paymentSubscriptionDto.email, paymentSubscriptionDto.name );

    const session = await this.stripe.checkout.sessions.create({
      subscription_data: {
        description: 'SPORT AI',
        metadata: {
          userId: paymentSubscriptionDto.userId,
        },
      },
      customer: customer.id,
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


  async getServices(){
    const services = (await this.stripe.subscriptions.list()).data

    return {
      services,
    };
  }


  async webhook( request:Request, response:Response, callbacks: CallbacksHookInterface ){
    const sig = request.headers['stripe-signature'];

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
        const userIdPayment = paymentIntentSucceeded.metadata.userId;

        if( userIdPayment ){
          callbacks.sessionPaymentSucces({data: paymentIntentSucceeded, userId: userIdPayment});
        }
        break;
      case 'customer.subscription.created': //? cuando el usuario hace una suscripcion
        const invoicePaymentSucceeded = event.data.object;
        const userId = invoicePaymentSucceeded.metadata.userId;

        if( userId ){
          callbacks.subscriptionPaymentSucces({data: invoicePaymentSucceeded, userId});
        }
        break;
      case 'customer.subscription.deleted': //? cuando el usuario cancela la suscripcion
        const invoicePaymentDeleted = event.data.object;
        break;
      default:
        break;
    }

    response.send();
  }

}