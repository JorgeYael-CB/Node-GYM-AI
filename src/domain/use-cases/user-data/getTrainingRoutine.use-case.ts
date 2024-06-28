import { PdfsAdapter } from "../../../config";
import { GetTrainingRoutineDto } from '../../dtos/user-data/getTrainingRoutine.dto';
import { CustomError } from "../../errors";
import { UsersRepository, UserDataRepository } from '../../repositories';



export class GetTrainingRoutineUseCase {

  constructor(
    private readonly pdfsAdapter: PdfsAdapter,
    private readonly usersRepository:UsersRepository,
    private readonly UserDataRepository:UserDataRepository
  ){};


  async trainingRoutine( getTrainingRoutineDto:GetTrainingRoutineDto ){
    //Validamos la fecha del ultimo mensaje
    const user = await this.usersRepository.checkRoutineDate( getTrainingRoutineDto.data.userId );
    if( !user ) throw CustomError.InternalServerError(`El usuario no viene al validar la feha de su ultimo mensaje`);

    //TODO: agregamos la fecha de su ultima rutina de entrenamiento
    const newData = await this.UserDataRepository.generateDataUser(getTrainingRoutineDto);

    // throw CustomError.BadRequestException(`YA ENTRO EN ESTE COMPONENTE`);
    return this.pdfsAdapter.trainingPdf(getTrainingRoutineDto, user.name);
  }

}
