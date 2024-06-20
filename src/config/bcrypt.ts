import { hashSync, compareSync } from 'bcrypt';



export class BcryptAdapter {

  constructor(){}

  hash( data: string ){
    return hashSync( data, 12 );
  }

  compare( data: string, encrypt: string ){
    return compareSync( data, encrypt );
  }

};