import { MailerAdapter } from "../../../config";
import { UsersRepository } from "../../repositories";



export class SubscriptionUserUseCase {

  constructor(
    private readonly usersRepository:UsersRepository,
    private readonly mailerAdapter: MailerAdapter,
  ){};


  subscription = () => {
  }

}
