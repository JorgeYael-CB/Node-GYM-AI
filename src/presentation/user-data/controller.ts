import { Request, Response } from "express";
import { GetTrainingRoutineDto } from '../../domain/dtos/user-data/getTrainingRoutine.dto';
import { GetTrainingRoutineUseCase } from "../../domain/use-cases/user-data";
import { PdfsAdapter } from "../../config";
import { CustomError } from "../../domain/errors";
import { UsersRepository, UserDataRepository } from "../../domain/repositories";



export class UserDataController {

  constructor(
    private readonly pdfsAdapter: PdfsAdapter,
    private readonly usersRepository: UsersRepository,
    private readonly userDataRepository: UserDataRepository
  ){}


  private handleError( err:any, res:Response ){
    if( err instanceof CustomError ){
      return res.status(err.codeError).json({error: err.error, status: err.codeError});
    }

    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
  }


  getTrainingRoutine = (req: Request, res: Response) => {
    const [error, getTrainingRoutineDto] = GetTrainingRoutineDto.create(req.body);
    if (error) return res.status(400).json({ error, status: 400 });

    new GetTrainingRoutineUseCase(this.pdfsAdapter, this.usersRepository, this.userDataRepository)
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
