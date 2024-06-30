

export class PaymentSubscriptionDto {

  constructor(
    public readonly productId: string,
    public readonly userId: string,
  ){};


  static create( body: {[key:string]: any} ):[string?, PaymentSubscriptionDto?]{
    const { productId, userId } = body;

    if( !productId ){
      return ['Missing productId']
    }

    if( !userId ){
      return ['Please contact support'];
    }


    return [ undefined, new PaymentSubscriptionDto(productId, userId) ];
  }

}
