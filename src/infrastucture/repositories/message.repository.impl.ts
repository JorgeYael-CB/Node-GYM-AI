import { SendMessageDto } from "../../domain/dtos";
import { PaginationDto } from "../../domain/dtos/helpers/pagination.dto";
import { MessageEntity } from "../../domain/entities";
import { MessageRepository } from "../../domain/repositories";
import { MessageDatasource } from '../../domain/datasources/messages.datasource';


export class MessageRepositoryImpl implements MessageRepository {

  constructor(
    private readonly MessageDatasource:MessageDatasource,
  ){}


  sendMessage(sendMessageDto: SendMessageDto, answer?: string): Promise<MessageEntity> {
    return this.MessageDatasource.sendMessage(sendMessageDto, answer);
  }


  getMessages(paginationDto: PaginationDto, userId: any): Promise<MessageEntity[]> {
    return this.MessageDatasource.getMessages(paginationDto, userId);
  }

}
