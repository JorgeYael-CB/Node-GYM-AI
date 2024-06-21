import { ValidateData } from "../../../config";

export class GetUserDto {

  constructor(
    readonly id?: string | number,
    readonly email?: string,
  ){}

  static create = ( body: {[key:string]: any} ):[string?, GetUserDto?] => {
    const { id, email } = body;

    if( !id && !email ) return ['You must enter the user ID or email.'];
    const [emailError, emailMapper] = email? ValidateData.email(email): [undefined, undefined];
    if( emailError ) return [emailError];

    return[undefined, new GetUserDto(id, emailMapper)];
  };
}