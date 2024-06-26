import { Request, Response } from "express";
import { GetTrainingRoutineDto } from '../../domain/dtos/user-data/getTrainingRoutine.dto';
import { GetTrainingRoutineUseCase } from "../../domain/use-cases/user-data";
import { PdfsAdapter } from "../../config";
import { CustomError } from "../../domain/errors";


export class UserDataController {

  constructor(
    private readonly pdfsAdapter: PdfsAdapter,
  ){}


  private handleError( err:any, res:Response ){
    if( err instanceof CustomError ){
      return res.status(err.codeError).json({error: err, status: err.codeError});
    }

    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
  }


  getTrainingRoutine = (req: Request, res: Response) => {
    const [error, getTrainingRoutineDto] = GetTrainingRoutineDto.create(req.body);
    if (error) return res.status(400).json({ error, status: 400 });

    new GetTrainingRoutineUseCase(this.pdfsAdapter)
      .trainingRoutine(getTrainingRoutineDto!)
      .then(data => {
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=routine.pdf'
        });

        res.end(data);
      })
      .catch(err => this.handleError(err, res));
  }

}
