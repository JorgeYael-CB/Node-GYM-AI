import { PdfsAdapter } from "../../../config";
import { GetTrainingRoutineDto } from '../../dtos/user-data/getTrainingRoutine.dto';
import { CustomError } from "../../errors";
import { UsersRepository } from '../../repositories';

export class GetTrainingRoutineUseCase {

  constructor(
    private readonly pdfsAdapter: PdfsAdapter,
    private readonly usersRepository:UsersRepository,
  ){};


  async trainingRoutine( getTrainingRoutineDto:GetTrainingRoutineDto ){
    //Validamos la fecha del ultimo mensaje
    const user = await this.usersRepository.checkRoutineDate( getTrainingRoutineDto.data.userId );
    if( !user ) throw CustomError.InternalServerError(`El usuario no viene al validar la feha de su ultimo mensaje`);

    //TODO: agregamos la fecha de su ultima rutina de entrenamiento

    const routine = this.pdfsAdapter.trainingPdf(getTrainingRoutineDto);
  }

}
