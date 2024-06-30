

export class CompareDateAdapter {

  constructor(){};


  compareDate(dateCompare: any, days:number = 1): string | boolean {
    const currentDate:any = new Date();
    const differenceInMilliseconds = currentDate - dateCompare;

    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    const hasOneDayPassed = differenceInDays >= days;

    if (hasOneDayPassed) {
      return true
    } else {
      const remainingMilliseconds = (1 - differenceInDays) * (1000 * 60 * 60 * 24);
      const hours = Math.floor((remainingMilliseconds / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remainingMilliseconds / (1000 * 60)) % 60);
      const seconds = Math.floor((remainingMilliseconds / 1000) % 60);

      return `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    }
  }

}
