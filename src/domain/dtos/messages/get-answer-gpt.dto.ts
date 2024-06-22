

export class GetAnswerGptDto {

  constructor(
    readonly userId: string,
    readonly messageId: string,
  ){}


  static create( body: {[key:string]: any} ):[string?, GetAnswerGptDto?]{
    const { userId, messageId } = body;


    if( !userId || !messageId ){
      return ['message and messageId is required'];
    }


    return [ undefined, new GetAnswerGptDto(userId, messageId) ];
  }

}
