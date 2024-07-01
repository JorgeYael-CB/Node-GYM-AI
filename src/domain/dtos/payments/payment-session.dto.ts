import { ValidateData } from "../../../config";
import { PaymentsProductInterface } from "../../interfaces";


type currency = 'mxn' | 'usd';


export class PaymentSessionDto {

  constructor(
    public readonly currency: currency,
    public readonly products: PaymentsProductInterface[],
    public readonly userId: string,
    public readonly name: string,
    public readonly email: string,
  ){}


  static create( body: {[key:string]: any} ):[string?, PaymentSessionDto?]{
    const { currency, products, userId, orderId, name, email } = body;
    let error: string = '';

    if( !currency || !products || !userId ){
      return ['currency and products is required'];
    }

    if( !name || !email ){
      return ['name and email is required'];
    }

    const [emailError, emailMapper] = ValidateData.email( email );
    if( emailError ) return [emailError];


    if( !Array.isArray( products ) || products.length <= 0 ){
      return ['Products is not valid!'];
    }

    products.forEach( product => {
      if( !product.name || !product.amount || !product.quantity || !product.productId ){
        error = 'The product list is not valid, productId, product required name, amount and quantity';
      }

      if( product.images && !Array.isArray(product.images) ){
        error = 'images of product is not valid element.';
      }
    });

    if( error !== '' ){
      return [error];
    }


    return[undefined, new PaymentSessionDto(currency, products, userId, name, emailMapper!)];
  }

}
