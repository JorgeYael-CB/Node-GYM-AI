export class PaginationDto {

  constructor(
    readonly page?: number,
    readonly limit?: number,
    readonly recent?: boolean,
  ){}

  static create = ( body: {[key:string]: any} ):[string?, PaginationDto?] => {
    const { page, limit, recent } = body;

    if( (page && isNaN(+page)) ||  (limit && isNaN(+limit)) ){
      return ['Page and limit is not valid!'];
    }

    if( +page < 0 || +limit <= 0 ){
      return ['page and limit they must be positive numbers'];
    }

    return[undefined, new PaginationDto(
      page ?? undefined,
      limit ?? undefined,
      !!recent)
    ];
  };
}