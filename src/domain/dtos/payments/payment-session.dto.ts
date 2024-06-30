

interface ProductInterface {
  name: string,
  amount: number,
  quantity: number,
  images?: string[],
}

type currency = 'mxn' | 'usd';


export class PaymentSessionDto {

  constructor(
    public readonly currency: currency,
    public readonly products: ProductInterface[],
    public readonly userId: string,
    public readonly orderId: string,
  ){}


  static create( body: {[key:string]: any} ):[string?, PaymentSessionDto?]{
    const { currency, products, userId, orderId } = body;
    let error: string = '';

    if( !currency || !products || !userId || !orderId ){
      return ['currency, orderId and products is required'];
    }

    if( !Array.isArray( products ) ){
      return ['Products is not valid!'];
    }

    if( products.length <= 0 ){
      return ['You need at least 1 item in the product array.'];
    }

    products.forEach( product => {
      if( !product.name || !product.amount || !product.quantity ){
        error = 'The product list is not valid, product required name, amount and quantity';
      }

      if( product.images && !Array.isArray(product.images) ){
        error = 'images of product is not valid element.';
      }
    });

    if( error !== '' ){
      return [error];
    }


    return[undefined, new PaymentSessionDto(currency, products, userId, orderId)];
  }

}
