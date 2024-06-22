import { isValidObjectId } from "mongoose";
import { userModel } from "../../../db/mongo";
import { MessageModel } from "../../../db/mongo/models/messages.model.mongo";
import { MessageDatasource } from "../../../domain/datasources";
import { SendMessageDto, PaginationDto } from "../../../domain/dtos";
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

  private async getUserById( id: any ){
    this.validateId(id);
    const user = await userModel.findById(id);
    if( !user ) throw CustomError.BadRequestException(`User not found`);

    return user;
  }

  async sendMessage(sendMessageDto: SendMessageDto, answer?: string): Promise<MessageEntity> {
    const user = await this.getUserById(sendMessageDto.userId);

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


  async getMessages(paginationDto: PaginationDto, userId: any): Promise<MessageEntity[]> {
    const { limit = 10, page = 0 } = paginationDto;
    const messages = await MessageModel.find({ sender: userId })
      .limit(limit)
      .skip(page * limit);

    return messages.map( msg => MessageMapper.getMessageFromObj(msg));
  }

}
