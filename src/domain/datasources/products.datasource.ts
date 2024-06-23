import { ProductEntity } from "../entities";



export abstract class productsDtasource {

  abstract createProduct():Promise<ProductEntity>;
  abstract getProducts():Promise<ProductEntity>;
  abstract updateProduct():Promise<ProductEntity>;

};
