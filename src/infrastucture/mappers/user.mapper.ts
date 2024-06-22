import { UserEntity } from "../../domain/entities";


export class UserMapper {

  static getUserFromObj( user: {[key:string]: any} ): UserEntity{
    const { id, _id, name, email, password, isVerify, isActive, roles, date, totalAmountPaid, messages, coments, limitMessage, lastDateMessage } = user;

    return new UserEntity( id || _id, name, email, password, isVerify, isActive, roles, date, totalAmountPaid, messages, coments, limitMessage, lastDateMessage )
  }

}
