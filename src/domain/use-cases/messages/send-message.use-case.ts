import { SendMessageDto } from "../../dtos";


export const SendMessageUseCase = async(
  sendMessageDto: SendMessageDto,
) => {
  const { message, userId } = sendMessageDto;

  //TODO: agregamos un nuevo mensaje para el usuario


  return {
    status: 200,
    message: 'se envio el mensaje correctamente!',
    messageId: Date.now(),
  }
};
