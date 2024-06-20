import { ValidateData } from "../../../config";

export class RegisterUserDto {

    constructor(
      public name: string,
      public email: string,
      public password: string,
    ){}

    static create = ( body: {[key:string]: any} ):[string?, RegisterUserDto?] => {
      const { name, email, password } = body;

      if( !name || !email || !password ) return ['name, email and password is required'];
      if( name.trim().length <= 5 ) return ['name is too short'];

      const [emailError, emailMapper] = ValidateData.email(email);
      const [passwordError, passwordMapper] = ValidateData.password(password);

      if( emailError || passwordError ){
        return [emailError ?? passwordError];
      }

      return[ undefined, new RegisterUserDto(name.trim(), emailMapper!, passwordMapper!) ];
    };

  }