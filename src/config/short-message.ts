export class ShortMessageAdapter {
  constructor() {}

  // Eliminar signos repetidos
  removeRepeatSign = (text: string): string => {
    return text.replace(/([!?.])\1+/g, '$1');
  };

  // Procesar el mensaje para eliminar espacios y capitalizar palabras
  getMessage = (message: string): string => {
    const messageMapeado = message.replace(/\s+/g, '');
    return this.removeRepeatSign(messageMapeado);
  };
}
