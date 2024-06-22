import { Request, Response } from "express";
import { GetAnswerGptDto, SendMessageDto } from "../../domain/dtos";
import { GetAnswerGptUseCase, SendMessageUseCase } from "../../domain/use-cases/messages";
import { CustomError } from "../../domain/errors";
import { GptServiceAdpater, ShortMessageAdapter } from "../../config";


export class MessageController {

  constructor(
    private readonly shortMessageAdapter: ShortMessageAdapter,
    private readonly gptServiceAdapter: GptServiceAdpater,
  ){}


  private handleError = ( err:any, res:Response ) => {
    if( err instanceof CustomError ){
      return res.status(err.codeError).json({error: err.message, status: err.codeError});
    }

    console.log(err);
    return res.status(500).json({error: 'Internal server error', status: 500});
  }


  sendMessage = ( req:Request, res:Response ) => {
    const [error, sendMessageDto] = SendMessageDto.create(req.body);
    if( error ) return res.status(400).json({error, status: 400});

    SendMessageUseCase(sendMessageDto!)
      .then( data => res.status(200).json(data) )
      .catch( err => this.handleError(err, res) );
  };


  getAnswerGpt = ( req:Request, res:Response ) => {
    const [error, getAnswerGptDto] = GetAnswerGptDto.create(req.body);
    if( error ) return res.status(400).json({error, status: 400});

    new GetAnswerGptUseCase(this.shortMessageAdapter, this.gptServiceAdapter)
      .answer(getAnswerGptDto!)
        .then( data => res.status(200).json(data) )
        .catch( err => this.handleError(err, res) );
  }

}
