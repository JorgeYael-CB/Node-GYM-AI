import { isValidObjectId } from "mongoose";
import { userModel } from "../../../db/mongo";
import { MessageModel } from "../../../db/mongo/models/messages.model.mongo";
import { MessageDatasource } from "../../../domain/datasources";
import { SendMessageDto } from "../../../domain/dtos";
import { PaginationDto } from "../../../domain/dtos/helpers/pagination.dto";
import { MessageEntity } from "../../../domain/entities";
import { MessageMapper } from "../../mappers";
import { CustomError } from "../../../domain/errors";


export class MessageDatasourceMongoImpl implements MessageDatasource {

  constructor(){}


  private validateId( id: any ){
    if( !isValidObjectId(id) ){
      throw CustomError.BadRequestException(`Id is not valid`);
    }
  }

  async sendMessage(sendMessageDto: SendMessageDto, answer?: string): Promise<MessageEntity> {
    this.validateId(sendMessageDto.userId);

    const user = await userModel.findById(sendMessageDto.userId);
    if( !user ) throw CustomError.BadRequestException(`User not found`);

    const newMessage = await MessageModel.create({
      sender: sendMessageDto.userId,
      date: new Date(),
      content: sendMessageDto.message,
      answer,
    });

    user.lastDateMessages.push( new Date() );
    user.messages.push(newMessage._id);

    await user.save();

    return MessageMapper.getMessageFromObj(newMessage);
  }


  async getMessages(paginationDto: PaginationDto): Promise<MessageEntity[]> {
    throw new Error("Method not implemented.");
  }

}
