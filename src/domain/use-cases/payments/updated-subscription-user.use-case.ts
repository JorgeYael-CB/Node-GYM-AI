import { UsersRepository } from "../../repositories";
import { SubscriptionPaymentSuccesType } from "../../types";


export class UpdatedSubscriptionUserUseCase {

  constructor(
    private readonly usersRepository: UsersRepository,
  ){}


  updated:SubscriptionPaymentSuccesType = async( {data, userId} ) => {
    const user = await this.usersRepository.updatedPayment( userId );

    //TODO: le enviamos un correo de confirmacion y guardamos el monto
    console.log(`El usuario: ${user.name} ha comprado una suscripcion`);
  }


}
