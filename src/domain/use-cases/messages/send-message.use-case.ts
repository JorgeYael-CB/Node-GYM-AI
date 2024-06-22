import { GptServiceAdpater, ShortMessageAdapter } from "../../../config";
import { SendMessageDto } from "../../dtos";
import { CustomError } from "../../errors";
import { MessageRepository, UsersRepository } from '../../repositories';



export class SendMessageUseCase {

  constructor(
    private readonly messageRepository:MessageRepository,
    private readonly shortMessageAdapter: ShortMessageAdapter,
    private readonly gptServiceAdapter: GptServiceAdpater,
    private readonly usersRepository:UsersRepository,
  ){}


  async send( sendMessageDto: SendMessageDto ){
    // TODO: validar los mensajes del usuario
    const user = await this.usersRepository.checkMessageDate(sendMessageDto.userId);

    const messageShort = this.shortMessageAdapter.getMessage('¿Cuantas calorias debo consumir si peso 120 kilos y quiero adelgazar? solo dispongo de 1 hora para entrenar ya que soy obeso y me siento muy triste, pipipipi.');

    // const openAI = await this.gptServiceAdapter.openai.chat.completions.create({
    //   messages: [
    //     {
    //       role: 'system',
    //       content: `
    //         ayudarascontodolorelacionadoadeporte,
    //         sialguiennohaceunapreguntarelacionadapuedesnegarlelarespuesta,siempretepresentarascomo
    //         asistentedeportistadeSPORTAIydebesresponderclaroybreve,cualquierdudapuedesdecirlequecontacten
    //         aunentrenadordeSPORTAI,siempretratadeayudaralosusuariosconsuspreguntas
    //         `
    //     },
    //     {
    //       role: 'user',
    //       content: messageShort,
    //     }
    //   ],
    //   model: 'gpt-3.5-turbo',
    //   max_tokens: 250,
    // })

    // console.log(openAI);
    // const answer = openAI.choices[0].message.content
    const answer = `Hello World`;

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