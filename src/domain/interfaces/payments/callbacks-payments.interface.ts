import { SessionPaymentSuccesType, SubscriptionPaymentCancelType, SubscriptionPaymentSuccesType } from "../../types";


export interface CallbacksHookInterface {
  sessionPaymentSucces: SessionPaymentSuccesType;
  subscriptionPaymentSucces: SubscriptionPaymentSuccesType;
  subscriptionPaymentCancel?: SubscriptionPaymentCancelType;
}