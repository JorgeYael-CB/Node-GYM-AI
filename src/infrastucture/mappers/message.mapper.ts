import { MessageEntity } from "../../domain/entities";


export class MessageMapper {

  static getMessageFromObj = (payload: { [key:string]:any }):MessageEntity => {
    const { sender, answer, date, id, _id, content } = payload;

    return new MessageEntity(sender, answer, date, id | _id, content);
  };

}
