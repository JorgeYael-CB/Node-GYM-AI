

export class MessageEntity {

  constructor(
    readonly sender: any,
    readonly answer: string,
    readonly date: Date,
    readonly id: string | number,
    readonly content: string,
  ){};

}
