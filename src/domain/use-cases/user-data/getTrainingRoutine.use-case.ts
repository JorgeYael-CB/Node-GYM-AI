import { MailerAdapter, PdfsAdapter } from "../../../config";
import { GetTrainingRoutineDto } from '../../dtos/user-data/getTrainingRoutine.dto';
import { CustomError } from "../../errors";
import { UsersRepository, UserDataRepository } from '../../repositories';
import fs from 'fs';



export class GetTrainingRoutineUseCase {

  constructor(
    private readonly pdfsAdapter: PdfsAdapter,
    private readonly usersRepository:UsersRepository,
    private readonly UserDataRepository:UserDataRepository,
    private readonly mailerAdapter:MailerAdapter,
    private readonly emailSupport: string,
  ){};


  async trainingRoutine( getTrainingRoutineDto:GetTrainingRoutineDto ){
    //Validamos la fecha del ultimo mensaje
    const user = await this.usersRepository.checkRoutineDate( getTrainingRoutineDto.data.userId );
    if( !user ) throw CustomError.InternalServerError(`El usuario no viene al validar la feha de su ultimo mensaje`);

    //TODO: agregamos la fecha de su ultima rutina de entrenamiento
    const newData = await this.UserDataRepository.generateDataUser(getTrainingRoutineDto);
    const pdf = await this.pdfsAdapter.trainingPdf(getTrainingRoutineDto, user.name);
    const textHtml = fs.readFileSync('src/files/templates/get-routine.html', {encoding: 'utf-8'})
      .replace('[[NAME]]', user.name)
      .replace('[[CORREO_SUPPORT]]', this.emailSupport);

    this.mailerAdapter.send({
      html: textHtml,
      subject: `Sport AI`,
      to: `${user.email}`,
      files: [{filename: `Sport AI - ${user.name}.pdf`, content: pdf}],
    });

    this.mailerAdapter.send({
      html: `El usuario: ${user.name} - ${user.email} ha generado una rutina de entrenamiento.`,
      subject: `Alguien genero una rutina`,
      to: `${this.emailSupport}`,
      files: [{filename: `Sport AI - ${user.name}.pdf`, content: pdf}],
    });

    //TODO: guardamos su PDF en un servicio

    return pdf;
  }

}
