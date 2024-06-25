import { UserDataDatasource } from "../../domain/datasources";
import { GetTrainingRoutineDto } from "../../domain/dtos";
import { UserDataEntity } from "../../domain/entities";
import { UserDataRepository } from "../../domain/repositories";


export class UserDataRepositoryImpl implements UserDataRepository {

  constructor(
    private readonly userDataDatasource: UserDataDatasource
  ){}

  getTrainingRoutine(data: GetTrainingRoutineDto): Promise<UserDataEntity> {
    return this.userDataDatasource.getTrainingRoutine(data);
  }

}
