

export class SendMessageDto {

  constructor(
    readonly userId: string | number,
    readonly message: string,
  ){}


  static create( body: {[key:string]: any} ):[string?, SendMessageDto?]{
    const { userId, message } = body;

    if( !userId ){
      return ['Oops!, try again later'];
    }

    if( !message ){
      return ['message is not valid!'];
    }


    return [ undefined, new SendMessageDto(userId, message) ];
  }

}
