


export class UserDataEntity {
  constructor(
    public readonly id: number | string,
    public readonly lastDate: Date,
    public readonly user: any,
    public readonly year: number,
    public readonly height: number,
    public readonly weight:number,
    public readonly aim: string,
    public readonly deport: string,
    public readonly medicalHistory: string,
    public readonly equipment: string,
    public readonly injuries?: string,
    public readonly foodRestrictions?:string,
    public readonly availableTimeForDay?: string,
    public readonly availableDaysForWeek?: string,
  ){}
}

