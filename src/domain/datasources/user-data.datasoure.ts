import { GetTrainingRoutineDto } from "../dtos";
import { UserDataEntity } from "../entities";



export abstract class UserDataDatasource {

  abstract getTrainingRoutine( data: GetTrainingRoutineDto ):Promise<UserDataEntity>;

}
