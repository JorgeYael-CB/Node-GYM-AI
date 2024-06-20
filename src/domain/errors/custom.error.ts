

export class CustomError extends Error {

  constructor(
    readonly codeError: number,
    readonly error: string
  ){
    super(error);
  };


  static BadRequestException( error: string, data: any ) {
    console.log({ error, data })
    return new CustomError(400, error);
  }

  static InternalServerError( error: string, data: any ){
    console.log({ error, data })
    return new CustomError(500, 'Error - Contact Support!');
  }

  static Unauthorized( error: string, data: any ){
    console.log({ error, data });
    return new CustomError( 401, error );
  }

}
