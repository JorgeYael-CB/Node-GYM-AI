import { MailerAdapter } from "../../../config";
import { GetUserDto } from "../../dtos";
import { UsersRepository } from "../../repositories";
import { SessionPaymentSuccesType } from "../../types";



export class UserPaymentUseCase {

  constructor(
    private readonly usersRepository:UsersRepository,
    private readonly mailerAdapter: MailerAdapter,
  ){};


  pay:SessionPaymentSuccesType = async({data, userId}) => {
    const user = await this.usersRepository.getUser( new GetUserDto(userId) );

    console.log(`El usuario: ${user.name} ha comprado por la cantidad de: ${data.amount}`);
  }

}
