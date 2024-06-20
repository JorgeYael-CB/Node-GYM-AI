

export class CodeRangeAdapter {

  constructor(){};

  generateRange( range = 6 ){
    let value = '';

    for (let n = 0; n <= range; n++) {
      value += Math.floor( Math.random() * 10 );
    }

    return value;
  }

}
