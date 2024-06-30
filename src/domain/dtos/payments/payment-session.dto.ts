interface ProductInterface {
  name: string,
  amount: number,
  quantity: number,
}

type currency = 'mxn' | 'usd';


export class PaymentSessionDto {

  constructor(
    public readonly currency: currency,
    public readonly products: ProductInterface[],
  ){}


  static create( body: {[key:string]: any} ):[string?, PaymentSessionDto?]{
    const { currency, products } = body;
    let error: string = '';

    if( !currency || !products ){
      return ['currency and products is required'];
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
    });

    if( error !== '' ){
      return [error];
    }


    return[undefined, new PaymentSessionDto(currency, products)];
  }

}
