import { Request, Response } from "express";
import { GetTrainingRoutineDto } from '../../domain/dtos/user-data/getTrainingRoutine.dto';


export class UserDataController {

  constructor(){}


  getTrainingRoutine = (req:Request, res:Response) => {
    const [error, getTrainingRoutineDto] = GetTrainingRoutineDto.create(req.body);
    if( error ) return res.status(400).json({error, status: 400});

    return res.json(getTrainingRoutineDto);
  }

}
