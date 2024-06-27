

interface Props {
  userId: any,
  year: number,
  height: number,
  weight:number,
  aim: string,
  deport: string,
  medicalHistory: string,
  equipment: string,
  sexo: string,
  injuries?: string,
  foodRestrictions?:string,
  availableTimeForDay?: string,
  availableDaysForWeek?: string,
}


export class GetTrainingRoutineDto {

  constructor(
    public readonly data: Props,
  ){}


  static create( body: {[string:string]:any} ):[string?, GetTrainingRoutineDto?]{
    const data = [ 'userId', 'year', 'height', 'weight', 'aim', 'deport', 'medicalHistory', 'equipment', 'sexo'];
    let error:string = '';

    data.forEach( element => {
      if( !Object.keys(body).includes(element) ){
        return error = `Element ${element} is required`;
      }
    });

    if( error !== '' ){
      return [error];
    };

    return[undefined, new GetTrainingRoutineDto({...body as Props})];
  }
}
