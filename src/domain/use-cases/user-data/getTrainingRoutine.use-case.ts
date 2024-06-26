import { PdfsAdapter } from "../../../config";
import { GetTrainingRoutineDto } from '../../dtos/user-data/getTrainingRoutine.dto';

export class GetTrainingRoutineUseCase {

  constructor(
    private readonly pdfsAdapter: PdfsAdapter,
  ){};


  async trainingRoutine( getTrainingRoutineDto:GetTrainingRoutineDto ){
    return this.pdfsAdapter.trainingPdf(getTrainingRoutineDto);
  }

}
