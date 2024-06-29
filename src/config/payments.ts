import Stripe from "stripe";


export class PaymentAdapter {

  private readonly stripe: Stripe;

  constructor(
    sk_key: string,
  ){
    this.stripe = new Stripe( sk_key );
  }


  createPaymentSession = async () => {
    const session = await this.stripe.checkout.sessions.create({

      // Colocar aqui el ID de la orden
      payment_intent_data: {
        metadata: {}
      },

      // Items que se van a comprar
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: `Sport-AI-Month`
            },
            unit_amount: 10000, // 100 pesos mxn
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: 'https://www.youtube.com',
      cancel_url: 'https://www.google.com',
    })


    return session;
  }


  createSubscriptionSession(){
  }

}