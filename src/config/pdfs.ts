import { GetTrainingRoutineDto } from '../domain/dtos';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { WritableStreamBuffer } from 'stream-buffers';
import { GptServiceAdpater } from './';
import { CustomError } from '../domain/errors';

import htmlToPdfMake from 'html-to-pdfmake'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts  from 'pdfmake/build/vfs_fonts';
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


  private async getTrainingDay(content: string) {
    const response = await this.gptServiceAdapter.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    const data = response.choices[0].message.content;
    if (!data) throw CustomError.InternalServerError('No viene el mensaje en Chat GPT-4');

    console.log(response);

    return data;
  }


  async trainingPdf({ data, data: {
    aim,
    deport,
    equipment,
    height,
    medicalHistory,
    weight,
    year,
    availableDaysForWeek = 'No definido',
    availableTimeForDay = 'No definido',
    foodRestrictions = 'No definido',
    injuries = 'No definido'
  }}: GetTrainingRoutineDto): Promise<Buffer> {

    const openAiData = await this.getTrainingDay(`
      Genera una rutina de entrenamiento profesional para el usuario,
      Informacion: 
      Objetivo: ${aim}, deporte: ${deport}, equipo que dispone: ${equipment},
      altura: ${height} cm, peso: ${weight}, historial medico: ${medicalHistory}, 
      su edad: ${year} años, dias disponibles para entrenar por semana: ${availableDaysForWeek}, 
      horas disponibles por dia: ${availableTimeForDay}, sus lesiones actuales y pasadas son: ${injuries}.
      Quiero que me mandes SOLO el formato en HTML para pasarlo a pdfmake, no quiero que escribas nada fuera de eso, tambien quiero 
      que le agregues un header y agregale diseno de tablas para los ejercicios, quiero que la rutina sea 
      completa por dia y por semana, con su dia y su rutina, mi empresa se llama SPORT AI y el footer tambien lo quiero bien, no quiero que generes el HTML, title ni nada de eso, dame el texto solo en STRING.
      no agregues esto: html
        <!DOCTYPE html>
        <html>
        <head>
        </head>
        <body>.
        Solo inicia con un main.
    `);

    const html = htmlToPdfMake(`${openAiData}`, {window: this.window});

    const docDefinition:TDocumentDefinitions = {
      content: [
        html
      ]
    }

    const options = {};

    const pdfDoc = this.printer.createPdfKitDocument(docDefinition, options);
    const stream = new WritableStreamBuffer();

    return new Promise((resolve, reject) => {
      pdfDoc.pipe(stream);
      pdfDoc.end();

      stream.on('finish', () => {
        const contents = stream.getContents();
        if (contents === false) {
          reject(new Error('No data available in the PDF stream.'));
        } else {
          resolve(contents);
        }
      });

      stream.on('error', (err: any) => {
        reject(err);
      });
    });
  }
}
