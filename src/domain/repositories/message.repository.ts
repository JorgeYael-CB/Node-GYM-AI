import { SendMessageDto } from "../dtos";
import { PaginationDto } from "../dtos/helpers/pagination.dto";
import { MessageEntity } from '../entities';


export abstract class MessageRepository {

  abstract sendMessage(sendMessageDto: SendMessageDto, answer?:string):Promise< MessageEntity >;
  abstract getMessages(paginationDto: PaginationDto, userId: any):Promise< MessageEntity[] >;

}
