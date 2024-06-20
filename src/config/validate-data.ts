

export class ValidateData {

  static email( email:string ): [string?, string?]{
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if( !email ) return['email is required'];
    if( !regex.test( email.trim() ) ) return ['email is not valid!'];

    return[undefined, email.trim().toLowerCase()];
  }

  static password( password:string ):[string?, string?]{
    if( !password ) return ['password is required'];
    if( !isNaN( +password ) ) return ['Pasword is not valid!'];
    if( password.length <= 5 ) return ['password is too short!'];
    if( password.length >= 100 ) return ['Passsword is too long'];

    return [undefined, password.trim()];
  }

}
