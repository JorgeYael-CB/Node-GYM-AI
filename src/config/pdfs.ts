import { GetTrainingRoutineDto } from '../domain/dtos';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { WritableStreamBuffer } from 'stream-buffers';
import { GptServiceAdpater } from './';
import { CustomError } from '../domain/errors';

import htmlToPdfMake from 'html-to-pdfmake';
import { JSDOM } from 'jsdom';

export class PdfsAdapter {
  private printer = new PdfPrinter({
    Roboto: {
      normal: 'src/fonts/Roboto/Roboto-Medium.ttf',
      bold: 'src/fonts/Roboto/Roboto-Bold.ttf',
      italics: 'src/fonts/Roboto/Italic-Bold.ttf',
    }
  });

  private window = new JSDOM('').window;

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
      temperature: 0.3,
    });

    const data = response.choices[0].message.content;
    if (!data) throw CustomError.InternalServerError('No viene el mensaje en Chat GPT-4');

    return data.replace(/```/g, '').replace('html', '');;
  }

  async trainingPdf({ data, data: {
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
  }}: GetTrainingRoutineDto): Promise<Buffer> {

    const daysM = [
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

    const tableDay = `
      <h3>Lunes</h3>
      <table style="width: 100%; border-collapse: collapse; text-align: center;">
        <tr>
            <th>Ejercicios</th>
            <th>Repeticiones</th>
            <th>Series</th>
            <th>Método</th>
        </tr>
        <tr>
            <td>Press de banca</td>
            <td>Fallo</td>
            <td>3</td>
            <td>Bajo tensión</td>
        </tr>
        <tr>
            <td>Press militar</td>
            <td>Fallo</td>
            <td>4</td>
            <td>Sin método</td>
        </tr>
        <tr>
            <td>Flexiones</td>
            <td>30</td>
            <td>4</td>
            <td>Sin método</td>
        </tr>
        <tr>
            <td>Laterales con mancuernas</td>
            <td>12-15</td>
            <td>4</td>
            <td>Bajo tensión</td>
        </tr>
      </table>
      <p style="margin-bottom: 50px;">
        Descripcion del dia Lunes: La duracion de los descansos deben ser de 2-3 minutos y los ejercicios van en biserie, cada vez que cambies de ejercicio debes descansar 30 segundos.
      </p>
    `;

    let routinePromises: Promise<any>[] = [];

    if (sexo === 'H') {
      daysM.forEach(day => {
        routinePromises.push(this.getTrainingDay(`Eres un entrenador profesional el cual debe darle rutinas avanzadas a los usuarios en base a sus datos 
          proporcionados, trabajas para SPORT AI, si es necesario agrega mas columnas o remueve columnas para mejores rutinas, modifica la plantilla como sea necesario.`, `
          Hola, genera una rutina deportiva, solo usa la plantilla que te dan y no agregues mas texto, solo el HTML con la plantilla que te dan, 
          esta es una tabla de ejemplo de como debes hacer las tablas, hoy es el dia: ${day.day} y el musculo que le toca es: ${day.muscle},
          este es el ejemplo de como debes hacerla, ira en formato HTML, solo remplaza las tablas con el ejercicio, si es necesario agrega mas o quita mas tabla.
          ${tableDay}
          el usuario mide: ${height}, pesa: ${weight}, tiene ${year} años, su historial medico es: ${medicalHistory}, dias disponibles por semana: ${availableDaysForWeek}, 
          horas disponibles por dia: ${availableTimeForDay}, el deporte que practica es ${deport}, su objetivo es: ${aim}, su equipo para entrenar es: ${equipment}, 
          sus restricciones de comida son: ${foodRestrictions}, la descripcion de sus lesiones: ${injuries} y su experiencia es ${experience}, con base a sus datos 
          genera una rutina especificamente para el usuario, con su horario, cuidado de lesiones, experiecia, objetivo, equipo para entrenar, edad y su peso, tambien puedes 
          modificar/agregar metodos, nuevos ejercicios, modificar la descripcion 
          para un mejor entendimiento de la rutina y mejor enfoque a su objetivo, TODO lo que sea necesario puedes modificar, solo generame una rutina especial para ese usuario.
          `
        ));
      });
    }

    const routineResults = await Promise.all(routinePromises);
    const routineHtml = routineResults.join('');
    const dieta = await this.getTrainingDay('Eres un nutricionista deportivo que ayuda con recomendaciones alimentarias a los usuarios, no agregues texto de mas, solo da especificamente la recomendacion de comida para antes de entrenar, despues de entrenar y durante el dia.', `
      Ayudame con mi comida y recomiendaciones, el deporte que practico es: ${deport}, restricciones de comida: ${foodRestrictions}, 
      mi historial medico es: ${medicalHistory}, peso: ${weight}, mido: ${height}, con esos datos dame unas recomiendaciones de comida especificamente para mi y mi objetivo.
      `)


    const openAiData = `
    <body style="margin: 0; padding: 20px; background-color: #fff;">
      <header style="text-align: center;">
        <h1 style="font-size: 24px; color: #333;">Rutina De Sport AI</h1>

        <h2 style="margin-top: 50px;">F.A.Q.</h2>
        <ul style="margin-bottom: 50px; list-style-type: none; padding-left: 0;">
            <li style="margin-bottom: 10px;">La rutina generada se le mandará a un entrenador de SPORT AI el cual se pondrá en contacto contigo por EMAIL.</li>
            <li style="margin-bottom: 10px;">Número de teléfono del administrador de la página: +52 5581262206. Si presenta algún problema, favor de comunicarse por ese medio.</li>
            <li style="margin-bottom: 10px;">Si presenta mareos, náuseas, dolor de cabeza o algún dolor anormal durante los entrenamientos, favor de contactar a soporte y a un entrenador certificado de SPORT AI.</li>
            <li style="margin-bottom: 10px;">Si necesita alguna duda durante los entrenamientos, favor de contactar a un entrenador de SPORT AI.</li>
            <li style="margin-bottom: 10px;">Esta rutina fue generada por Inteligencia Artificial. Para mayor soporte, favor de contactar a un entrenador certificado de SPORT AI.</li>
            <li style="margin-bottom: 10px;">Recuerda que tienes acceso a soporte con entrenadores y a un bot de asistencia que te puede ayudar con tus dudas durante tus entrenamientos.</li>
            <li style="margin-bottom: 10px;">Si la rutina generada no es de tu agrado, por favor, contacte a un entrenador personal de SPORT AI para una rutina adecuada a tus necesidades.</li>
            <li style="margin-bottom: 10px;">Recuerda mandarle esta rutina a un entrenador profesional. La rutina está hecha de forma profesional con mediciones previas, pero puede no ser 100% perfecta. Le recomendamos que siempre que genere una rutina automatizada se la mande a un instructor de SPORT AI para una mejor experiencia.</li>
        </ul>
      </header>
      <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2>Datos del Usuario</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="padding: 12px; border: 1px solid #ddd; background-color: #f2f2f2;">Nombre</th>
                <td style="padding: 12px; border: 1px solid #ddd;"> [[NAME]] </td>
            </tr>
            <tr>
                <th style="padding: 12px; border: 1px solid #ddd; background-color: #f2f2f2;">Edad</th>
                <td style="padding: 12px; border: 1px solid #ddd;">${year}</td>
            </tr>
            <tr>
                <th style="padding: 12px; border: 1px solid #ddd; background-color: #f2f2f2;">Altura</th>
                <td style="padding: 12px; border: 1px solid #ddd;">${height} cm</td>
            </tr>
            <tr>
                <th style="padding: 12px; border: 1px solid #ddd; background-color: #f2f2f2;">Peso</th>
                <td style="padding: 12px; border: 1px solid #ddd;">${weight} kg</td>
            </tr>
            <tr>
                <th style="padding: 12px; border: 1px solid #ddd; background-color: #f2f2f2;">Objetivo</th>
                <td style="padding: 12px; border: 1px solid #ddd;">${aim}</td>
            </tr>
            <tr>
                <th style="padding: 12px; border: 1px solid #ddd; background-color: #f2f2f2;">Historial Médico</th>
                <td style="padding: 12px; border: 1px solid #ddd;">${injuries}</td>
            </tr>
            <tr>
                <th style="padding: 12px; border: 1px solid #ddd; background-color: #f2f2f2;">Restricciones de Comida</th>
                <td style="padding: 12px; border: 1px solid #ddd;">${foodRestrictions}</td>
            </tr>
        </table>

        <h2 style="margin-top: 30px;">Días Disponibles</h2>
        <p>${availableDaysForWeek}</p>
        <h2 style="margin-top: 30px;">Horas Disponibles</h2>
        <p>${availableTimeForDay}</p>
        <h2 style="margin-top: 30px;">Equipo Disponible</h2>
        <p>${equipment}</p>
        <h2 style="margin-top: 30px;">Descripción de Lesiones</h2>
        <p>${injuries}</p>
        <h2 style="margin-top: 30px;">Historial Medico</h2>
        <p>${medicalHistory}</p>
      </div>
      <section>
        ${routineHtml}
      </section>

      <p>Recomendaciones de comida para ti.</p>
      <p>${dieta}</p>
    </body>
    `;

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
