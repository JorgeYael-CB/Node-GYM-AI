import { UserDataEntity } from "../../domain/entities";


export class UserDataMapper {

  static getUserDataFromObj( data: {[key:string]: any} ): UserDataEntity{
    const {
      id,
      _id,
      user,
      year,
      heihgt,
      weight,
      aim,
      deport,
      medicalHistory,
      equipment,
      sexo,
      experience,
      injures,
      foodRestrictions,
      availableTimeForDay,
      availableDaysForWeek
    } = data;

    return new UserDataEntity(id ?? _id, user, year, heihgt, weight, aim, deport, medicalHistory, equipment, sexo, experience, injures, foodRestrictions, availableTimeForDay, availableDaysForWeek);
  }

}
