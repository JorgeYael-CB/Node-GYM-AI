export class UserEntity {

  constructor(
    private readonly id: number | string,
    private readonly name: string,
    private readonly email: string,
    private readonly password: string,
    private readonly isVerify: boolean,
    private readonly isActive: boolean,
  ){}

};