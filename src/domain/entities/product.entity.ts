import { roles } from "../types";

export class ProductEntity {

  constructor(
    readonly id: string | number,
    readonly date:Date,
    readonly title:string,
    readonly description:string,
    readonly available:boolean,
    readonly img:string,
    readonly price:number,
    readonly discount:number,
    readonly role: roles,
  ){}

}
