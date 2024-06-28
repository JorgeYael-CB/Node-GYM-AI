import { isValidObjectId } from "mongoose";
import { UserDataModel, userModel } from "../../../db/mongo";
import { UserDataDatasource } from "../../../domain/datasources";
import { GetTrainingRoutineDto } from "../../../domain/dtos";
import { UserDataEntity } from "../../../domain/entities";
import { UserDataMapper } from "../../mappers";
import { CustomError } from "../../../domain/errors";


export class UserDataDatasourceMongoImpl implements UserDataDatasource {

  constructor(){}


  private async getUserBy(userId: any){
    if( !isValidObjectId(userId) ){
      throw CustomError.BadRequestException(`id '${userId}' is not valid`);
    }

    const user = await userModel.findById(userId);
    if( !user ){
      throw CustomError.BadRequestException(`User not found`);
    }

    return user;
  }


  async generateDataUser(data: GetTrainingRoutineDto): Promise<UserDataEntity> {
    const { data: {aim, deport, equipment, experience, height, medicalHistory, sexo, userId, weight, year, availableDaysForWeek, availableTimeForDay, foodRestrictions, injuries} } = data;

    const user = await this.getUserBy(userId);
    const newData = await UserDataModel.create({
      aim,
      availableDaysForWeek,
      availableTimeForDay,
      deport,
      equipment,
      experience,
      foodRestrictions,
      height,
      injuries,
      medicalHistory,
      sexo,
      weight,
      year,
      user: userId,
      lastDate: new Date(),
    });

    user.routineDate.push(new Date());
    user.data.push(newData._id);

    await user.save();
    return UserDataMapper.getUserDataFromObj(newData);
  }


  getTrainingRoutine(data: GetTrainingRoutineDto): Promise<UserDataEntity> {
    throw new Error("Method not implemented.");
  }

}
