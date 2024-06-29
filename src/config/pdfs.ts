import { GetTrainingRoutineDto } from '../domain/dtos';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { WritableStreamBuffer } from 'stream-buffers';
import { GptServiceAdpater } from './';
import { CustomError } from '../domain/errors';
import htmlToPdfMake from 'html-to-pdfmake';
import { JSDOM } from 'jsdom';
import fs from 'fs';




export class PdfsAdapter {

  private printer = new PdfPrinter({
    Roboto: {
      normal: 'src/fonts/Roboto/Roboto-Medium.ttf',
      bold: 'src/fonts/Roboto/Roboto-Bold.ttf',
      italics: 'src/fonts/Roboto/Italic-Bold.ttf',
    }
  });

  private window = new JSDOM('').window;


  public daysM = [
    {
      day: 'Lunes',
      muscle: 'Pecho, Hombro y Triceps',
    },
    {
      day: 'Martes',
      muscle: 'Espalda y Biceps',
    },
    {
      day: 'Miercoles',
      muscle: 'Pierna (enfoque en los cuadriceps)',
    },
    {
      day: 'Jueves',
      muscle: 'Pecho Hombro y Triceps'
    },
    {
      day: 'Viernes',
      muscle: 'Espalda y Biceps'
    },
    {
      day: 'Sabado',
      muscle: 'Pierna (enfoque en el femoral y pantorrilla)',
    }
  ];

  public daysF = [
    {
      day: 'Lunes',
      muscle: 'Pierna (femoral y gluteos)',
    },
    {
      day: 'Martes',
      muscle: 'Pecho, hombro y triceps',
    },
    {
      day: 'Miercoles',
      muscle: 'Pierna (Cuadriceps, abductores y pantorrilla)',
    },
    {
      day: 'Jueves',
      muscle: 'Espalda y Biceps'
    },
    {
      day: 'Viernes',
      muscle: 'Pierna (femoral, gluteo, cuadriceps y pantorrilla)'
    },
    {
      day: 'Sabado',
      muscle: 'parte superior, empuje y jalon.',
    }
  ];


  constructor(
    private readonly gptServiceAdapter: GptServiceAdpater,
  ) {}

  private async getTrainingDay(content: string, userContent: string) {
    const response = await this.gptServiceAdapter.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content,
        },
        {
          role: 'user',
          content: userContent,
        }
      ],
      model: 'gpt-4o',
      // model: 'gpt-3.5-turbo',
    });

    const data = response.choices[0].message.content;
    if (!data) throw CustomError.InternalServerError('No viene el mensaje en Chat GPT-4');

    return data.replace(/```/g, '').replace('html', '');
  }


  private textRoutine( tableDay:string, userDescription:string, day: string, muscle: string, ){
    return {
      openAi: `Eres un entrenador profesional el cual debe darle rutinas avanzadas a los usuarios en base a sus datos 
        proporcionados, llena la tabla que te dan con los 
        mejores datos para el usuario, es necesario que los completes con informacion importante y 
        sobre todo, que sean coherentes para su rutina del usuario, tambien agrega ejercicios, series, todo lo que sea, solo adapta una rutina para el usuario.
        Trabajas para SPORT AI, si es necesario agrega mas columnas o remueve columnas para mejores rutinas, modifica la plantilla como sea necesario.`,
      user: ` Hola, genera una rutina deportiva, solo usa la plantilla que te dan y no agregues mas texto, solo el HTML con la plantilla que te dan, 
          esta es una tabla de ejemplo de como debes hacer las tablas, hoy es el dia: ${day} y el musculo que le toca es: ${muscle},
          este es el ejemplo de como debes hacerla, ira en formato HTML, solo remplaza las tablas con el ejercicio, si es necesario agrega mas o quita mas tabla.
          ${tableDay}
          ${userDescription}, con base a sus datos 
          genera una rutina especificamente para el usuario, con su horario, cuidado de lesiones, experiecia, objetivo, equipo para entrenar, edad y su peso, tambien puedes 
          modificar/agregar metodos, nuevos ejercicios, modificar la descripcion, el usuario es de sexo Femenino, 
          para un mejor entendimiento de la rutina y mejor enfoque a su objetivo, TODO lo que sea necesario puedes modificar, solo generame una rutina especial para ese usuario con sus datos.
          , puedes agregar metodos nuevos, diferentes series y agregar las repeticiones que requiera la rutina.`
    }
  }


  async trainingPdf({data: {
    aim,
    deport,
    equipment,
    height,
    medicalHistory,
    weight,
    year,
    sexo,
    experience,
    availableDaysForWeek = 'No definido',
    availableTimeForDay = 'No definido',
    foodRestrictions = 'No definido',
    injuries = 'No definido',
  }}: GetTrainingRoutineDto, userName: string): Promise<Buffer> {

    const tableDay = fs.readFileSync('src/files/templates/table-day-routine.html', {encoding: 'utf-8'});

    let routinePromises: Promise<any>[] = [];
    const userDescription = `el usuario mide: ${height}, pesa: ${weight}, tiene ${year} años, su historial medico es: ${medicalHistory}, dias disponibles por semana: ${availableDaysForWeek}, 
          horas disponibles por dia: ${availableTimeForDay}, el deporte que practica es ${deport}, su objetivo es: ${aim}, su equipo para entrenar es: ${equipment}, 
          sus restricciones de comida son: ${foodRestrictions}, la descripcion de sus lesiones: ${injuries} y su experiencia es ${experience}`;

    if (sexo === 'M') {
      this.daysM.forEach(day => {
        const data = this.textRoutine(tableDay, userDescription, day.day, day.muscle);
        routinePromises.push(this.getTrainingDay( data.openAi, data.user ));
      });
    }else if( sexo === 'F' ){
      this.daysF.forEach(day => {
        const data = this.textRoutine(tableDay, userDescription, day.day, day.muscle);
        routinePromises.push(this.getTrainingDay( data.openAi, data.user ));
      });
    }

    const routineResults = await Promise.all(routinePromises);
    const routineHtml = routineResults.join('');
    const dieta = await this.getTrainingDay('Eres un nutricionista deportivo que ayuda con recomendaciones alimentarias a los usuarios, no agregues texto de mas, solo da especificamente la recomendacion de comida para antes de entrenar, despues de entrenar y durante el dia.', `
      Ayudame con mi comida y recomiendaciones, ${userDescription}, con esos datos dame unas recomiendaciones de comida especificamente para mi y mi objetivo. 
      dame el texto en formato HTML, tu respuesta estara dentro de un parrafo (<p></p>) asi que damelo especialmente para eso
      `);

    const recomendacion = await this.getTrainingDay(`
      Eres un entrenador personal que ayuda a los usuarios con sus entrenamientos
      `, `
      Ayudame con recomendaciones para mejorar en mis entrenamientos, ${userDescription}, con esos datos, dame recomendaciones 
      especificamente para mi de como mejorar en el deporte que practico, no digas nada fuera de eso, solo dame lo que te pedi. 
      dame el texto en formato HTML, tu respuesta estara dentro de un parrafo (<p></p>) asi que damelo especialmente para eso
      `);


    const openAiData = fs.readFileSync('src/files/templates/routine.html', 'utf-8')
      .replace('[[USERNAME]]', userName)
      .replace('[[YEAR]]', `${year}`)
      .replace('[[HEIGHT]]', `${height}`)
      .replace('[[WEIGHT]]', `${weight}`)
      .replace('[[AIM]]', `${aim}`)
      .replace('[[MEDICALHISTORY]]', `${medicalHistory}`)
      .replace('[[FOODRESTRICTIONS]]', `${foodRestrictions}`)
      .replace('[[ROUTINEHTML]]', `${routineHtml}`)
      .replace('[[DIETA]]', `${dieta}`)
      .replace('[[RECOMENDACION]]', `${recomendacion}`);


    const documentDefinitions: TDocumentDefinitions = {
      content: [
        htmlToPdfMake(openAiData, { window: this.window }),
      ],
      defaultStyle: {
        font: 'Roboto',
      }
    };

    const pdfDoc = this.printer.createPdfKitDocument(documentDefinitions);

    const streamBuffer = new WritableStreamBuffer();

    pdfDoc.pipe(streamBuffer);
    pdfDoc.end();

    return new Promise<Buffer>((resolve, reject) => {
      streamBuffer.on('finish', () => resolve(streamBuffer.getContents() as Buffer));
      streamBuffer.on('error', reject);
    });
  }
}
