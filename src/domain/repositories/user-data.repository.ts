import { GetTrainingRoutineDto } from "../dtos";
import { UserDataEntity } from "../entities";



export abstract class UserDataRepository {

  abstract getTrainingRoutine( data: GetTrainingRoutineDto ):Promise<UserDataEntity>;

}
