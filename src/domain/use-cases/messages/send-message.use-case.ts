import { GptServiceAdpater, ShortMessageAdapter, envs } from "../../../config";
import { SendMessageDto } from "../../dtos";
import { CustomError } from "../../errors";
import { MessageRepository, UsersRepository } from '../../repositories';



export class SendMessageUseCase {

  constructor(
    private readonly messageRepository:MessageRepository,
    private readonly shortMessageAdapter: ShortMessageAdapter,
    private readonly gptServiceAdapter: GptServiceAdpater,
    private readonly usersRepository:UsersRepository,
    private readonly chatOpenAI: boolean = envs.CHAT_OPEN_AI,
  ){}


  async send( sendMessageDto: SendMessageDto ){
    // TODO: validar los mensajes del usuario
    const user = await this.usersRepository.checkMessageDate(sendMessageDto.userId);
    let answer:string = '';

    if( this.chatOpenAI ){
      const messageShort = this.shortMessageAdapter.getMessage(sendMessageDto.message);
      const openAI = await this.gptServiceAdapter.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `
              ayudarascontodolorelacionadoadeporte,siempremedaraslasrespuestasenmarkdown,
              sialguiennohaceunapreguntarelacionadapuedesnegarlelarespuesta,debesresponderclaroybreve,cualquierdudapuedesdecirlequecontacten
              aunentrenadorde SPORT AI.
              `
          },
          {
            role: 'user',
            content: messageShort,
          }
        ],
        model: 'gpt-4o',
        max_tokens: 2000,
      })

      if( !openAI ) throw CustomError.InternalServerError(`No viene la respuesta de GPT`);
      console.log(openAI);
      answer = openAI.choices[0].message.content ?? '';
    } else {
      answer = `Hello World`;
    }

    if( !answer ) throw CustomError.InternalServerError(`No viene la respuesta de chat GPT`);

    const message = await this.messageRepository.sendMessage(sendMessageDto, answer);
    if( !message ) throw CustomError.InternalServerError('No viene el mensaje al registrar uno nuevo', {file: __dirname});

    return {
      status: 200,
      message: message.content,
      answer,
    }
  }
}