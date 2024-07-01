import Stripe from "stripe";



export type SessionPaymentSuccesType = ( params:{userId: any, data: Stripe.PaymentIntent}) => void;
export type SubscriptionPaymentSuccesType = ( params: {userId: any, data: Stripe.Subscription} ) => void;
export type SubscriptionPaymentCancelType = ( params: {userId: any, data: Stripe.Subscription} ) => void;