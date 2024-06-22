import { GetAnswerGptDto } from "../../dtos";
import { GptServiceAdpater, ShortMessageAdapter } from '../../../config';



export class GetAnswerGptUseCase {

  constructor(
    private readonly shortMessageAdapter:ShortMessageAdapter,
    private readonly gptServiceAdapter: GptServiceAdpater,
  ){};


  async answer( {messageId, userId}: GetAnswerGptDto ){
    //TODO: guardamos la respuesta en la base de datos

    //TODO: mapeamos la respuesta a menos tokens
    const message = this.shortMessageAdapter.getMessage('Quiero saber cuantas calorias debo consumir, peso 70 kilos y mido 1.70, quiero aumentar masa muscular');

    // const openAI = await this.gptServiceAdapter.openai.chat.completions.create({
    //   messages: [
    //     {
    //       role: 'system',
    //       content: `
    //         Ayudaras todo lo relacionado a deporte,
    //         si alguien no hace una pregunta relacioanda a eso puedes negarle la respuesta, siempre te presentaras 
    //         como su asistente deportista de SPORT AI
    //         `
    //     },
    //     {
    //       role: 'user',
    //       content: message,
    //     }
    //   ],
    //   model: 'gpt-3.5-turbo',
    // })

    // console.log(openAI);
    // const answer = openAI.choices[0].message.content
    const answer = `
      ¡Hola! Soy tu asistente deportista de SPORT AI. Para aumentar masa muscular, es importante que consumas una cantidad adecuada de calorías, 
      proteínas y carbohidratos. Generalmente, se recomienda consumir un excedente calórico de aproximadamente 
      500 calorías por día para aumentar masa muscular de forma gradual y saludable.\n\nDado tu peso de 70 kilos y estatura de 1.70 metros, 
      tu tasa metabólica basal (TMB) es de aproximadamente 1630 calorías al día. Si deseas aumentar masa muscular, podrías empezar consumiendo 
      alrededor de 2000 a 2200 calorías al día, dependiendo de tu nivel de actividad física y de cómo responda tu cuerpo a este aumento de calorías.\n\nRecuerda 
      que es importante también tener en cuenta la calidad de los alimentos que consumes, dando prioridad a fuentes de proteínas magras, 
      arbohidratos complejos, grasas saludables y alimentos ricos en vitaminas y minerales.\n\nSi 
      necesitas ayuda con un plan de alimentación más detallado o con algún otro aspecto relacionado al deporte, ¡estaré aquí para asistirte!
    `;


    //TODO: mandamos una respuesta con el modelo de GPT


    return {
      status: 200,
      answer,
      message,
    }
  }
}