import jwt from 'jsonwebtoken';


export class JwtAdapter {

  constructor(
    private readonly seed:string,
  ){};

  async generateToken(
    payload: Object,
    duration:string = '2h'
  ): Promise<string | null>{
    return new Promise( resolve => {
      jwt.sign(payload, this.seed, {expiresIn: duration}, ( err, token ) => {
        if( err ) return resolve(null);
        return resolve(token!);
      })
    })
  };


  async validateToken<T>( token:string ):Promise<T | null>{
    return new Promise( resolve => {
      jwt.verify( token, this.seed, (err, decoeded) => {
        if( err ) return resolve( null );
        return resolve(decoeded as T);
      })
    })
  };


}
