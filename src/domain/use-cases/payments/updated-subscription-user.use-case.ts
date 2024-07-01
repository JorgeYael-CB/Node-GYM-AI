import { MailerAdapter } from "../../../config";
import { UsersRepository } from "../../repositories";
import { SubscriptionPaymentSuccesType } from "../../types";



export class UpdatedSubscriptionUserUseCase {

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailerAdapter:MailerAdapter,
  ){}


  updated:SubscriptionPaymentSuccesType = async( {data, userId} ) => {
    const user = await this.usersRepository.updatedPayment( userId );

    console.log(`El usuario: ${user.name} ha comprado una suscripcion`);
  }


}
