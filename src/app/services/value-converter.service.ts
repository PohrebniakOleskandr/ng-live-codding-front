import { Injectable } from '@angular/core';
import { getRandomNumber } from '../utilities/get-random-number.function';

// Current options:
//2
//2-4
//[7,11,5]
//+2
//-2
//+[7,11,5]

@Injectable({
  providedIn: 'root',
})
export class ValueConverterService {
  // todo: rename, it's not only freq (str) to number but any special formatted str to val
  frStrToNumber(txt: string = '', currentPositionInTact: number): number {
    //debugger;
    let adder = 0;

    if(txt?.length <1) {
      return 0;
    }

    if(txt.includes('+')){
      adder+=currentPositionInTact;
    }

    if(txt[0] === '-') {
      adder-=currentPositionInTact;
      return (-1)*+txt + adder;
    }

    // рандомно з діапазону
    if(txt.includes('-')) {
      const fromTo = txt.split('-');
      return +getRandomNumber(+fromTo[0]+adder, +fromTo[1]+adder);
    // рандомне з набору
    } else if(txt.includes('[')) {
      let arr;
      if(txt.includes('+')){
        arr = JSON.parse(txt.replace('+', ''));
        //here?
        return +arr[adder%arr.length];
      } else {
        arr = JSON.parse(txt);
        return +arr[getRandomNumber(0, arr.length - 1)];
      }
    }
    else {
      return +txt+adder;
    }
  }
}

