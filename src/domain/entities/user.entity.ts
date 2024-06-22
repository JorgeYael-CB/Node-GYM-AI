export class UserEntity {

  constructor(
    readonly id: number | string,
    readonly name: string,
    readonly email: string,
    readonly password: string,
    readonly isVerify: boolean,
    readonly isActive: boolean,
    readonly roles: string[],
    readonly date: Date,
    readonly totalAmountPaid: number,
    readonly messages: any,
    readonly coments: any,
    readonly limitMessage: number,
    readonly lastDateMessages: Date[],
  ){}

};