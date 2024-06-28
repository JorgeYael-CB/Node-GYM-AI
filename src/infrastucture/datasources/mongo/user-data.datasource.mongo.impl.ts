import { UserDataDatasource } from "../../../domain/datasources";
import { GetTrainingRoutineDto } from "../../../domain/dtos";
import { UserDataEntity } from "../../../domain/entities";


export class UserDataDatasourceMongoImpl implements UserDataDatasource {

  constructor(){}


  getTrainingRoutine(data: GetTrainingRoutineDto): Promise<UserDataEntity> {
    throw new Error("Method not implemented.");
  }

}
