import { Request, Response } from "express";
import { PaymentSessionDto, PaymentSubscriptionDto } from "../../domain/dtos/payments";
import { PaymentAdapter } from "../../config";
import { CustomError } from "../../domain/errors";



export class PaymentController {

  constructor(
    private readonly paymentAdapter: PaymentAdapter,
  ){}


  private handleError( err: any, res:Response ){
    if( err instanceof CustomError ){
      return res.status(err.codeError).json({err: err.error, status: err.codeError});
    }

    console.log(err);
    return res.status(500).json({error: 'Internal Server Error', status: 500});
  }


  paymentSession = ( req:Request, res:Response ) => {
    const [ error, paymentSessionDto ] = PaymentSessionDto.create( req.body );
    if( error ) return res.status(400).json({error, status: 400});

    this.paymentAdapter.createPaymentSession( paymentSessionDto! )
      .then( data => res.status(200).json(data) )
      .catch( err => this.handleError(err, res) );
  }


  paymentSubscription = ( req:Request, res:Response ) => {
    const [error, paymentSubscriptionDto] = PaymentSubscriptionDto.create( req.body );
    if( error ) return res.status(400).json({error, status: 400});

    this.paymentAdapter.createSubscriptionSession( paymentSubscriptionDto! )
      .then( data => res.status(200).json(data) )
      .catch( err => this.handleError(err, res) );
  }


  paymentWebhook = ( req:Request, res:Response ) => {
    this.paymentAdapter.webhook(req, res)
      .then( data => {})
      .catch( err => this.handleError(err, res) );
  }

}
