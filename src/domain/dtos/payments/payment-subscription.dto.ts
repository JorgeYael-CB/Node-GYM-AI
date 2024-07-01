import { ValidateData } from "../../../config";


export class PaymentSubscriptionDto {

  constructor(
    public readonly productId: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly name: string,
  ){};


  static create( body: {[key:string]: any} ):[string?, PaymentSubscriptionDto?]{
    const { productId, userId, email, name } = body;

    if( !productId || !userId ){
      return ['Missing productId and id']
    }

    if( !name ) return ['Missing name'];

    const [emailError, emailMapper] = ValidateData.email( email );
    if( emailError )[emailError];

    return [ undefined, new PaymentSubscriptionDto(productId, userId, emailMapper!, name) ];
  }

}
