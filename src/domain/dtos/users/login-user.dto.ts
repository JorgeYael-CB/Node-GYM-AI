import { ValidateData } from "../../../config";


export class LoginUserDto {

  constructor(
    public readonly email: string,
    public readonly password: string,
  ){}


  static create = ( obj: {[key:string]: any} ):[string?, LoginUserDto?] => {
    const { email, password } = obj;

    const [emailError, emailMapper] = ValidateData.email(email);
    const [passwordError, passwordMapper] = ValidateData.password(password);

    if( emailError || passwordError ){
      return [emailError ?? passwordError];
    }

    return[undefined, new LoginUserDto(emailMapper!, passwordMapper!)];
  };

}