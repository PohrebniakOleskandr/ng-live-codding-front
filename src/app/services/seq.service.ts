import { Injectable, inject } from '@angular/core';
import { getRandomNumber } from '../utilities/get-random-number.function';


@Injectable({ providedIn: 'root' })
export class SeqService {
  // a. '0,1+2n3n'
  //    '0,1+'

  // b. '-----X-----X----'

  // c. 'R(X--)'
  decodeGridLine(line: string) {
   if(line.includes('R')) {
    //debugger;
    const lineWithoutR = line.replaceAll('R(','');
    const clearedLine = lineWithoutR.replaceAll(')','');

    let newStr = '';
    for(let i = 0; i <= Math.floor(16/clearedLine.length); i++) {
      newStr += clearedLine;
    }
    newStr += clearedLine.slice(0, Math.floor(16/clearedLine.length));
    //debugger;
    return newStr;

    // 16%clearedLine.length               //сколько клеточек еще остается
    // Math.floor(16/clearedLine.length)   //сколько целых рах помещается
    //                                     //сколько откусить от начала
   }

   if(line.length !== 16) {
     const arr = line.split('+');
     const firstPositions = arr[0].split(',').map(el => +el);
     debugger;
     const times = arr[1].replaceAll('n', ' ').split(' ').filter(el => el).map(el => +el);

     const newLine = (Array.from({ length: 16 }).reduce(
      (accumulator: any, currentValue, index) => {
        let currentSml;
        if(firstPositions.some(firstPosition => index === firstPosition)) {
          currentSml = 'X';
        } else if(times.some((time)=>index%time===0)) {
          currentSml = 'X';
        } else {
          currentSml = '-';
        }
        return [...accumulator, currentSml];
      },
      [],
    ) as any).join('');

    // console.log('newLine:');
    // console.log(newLine);

    return newLine;
   } else {
    return line;
   }
  }

  getOddSeq() {
    return Array.from({ length: 16 }, (el, idx) => idx%2 === 0 ? 'X': '-')
      .join('');
  }

  getEvenSeq() {
    return Array.from({ length: 16 }, (el, idx) => idx%2 !== 0 ? 'X': '-')
      .join('');
  }

  getDefaultSeq() {
    return Array.from({ length: 16 }, () => '-').join('');
  }

  getRandomSeq(uniqueSounds: string[]) {
    return Array.from(
      { length: 16 },
      () => {
        return Math.random() > 0.5 ?
        uniqueSounds[
            getRandomNumber(0, uniqueSounds.length-  1)
          ] : '-';
      }).join('');
  }

  // convertToSequenses(instrumentUrls: any) {
  //   return Object.keys(instrumentUrls).reduce((sum, key) => ({
  //     ...sum,
  //     [key]: TECNHO_CORE_INSTRUMENTS.includes(key) ?
  //       this.getRandomSeq() : this.getDefaultSeq(),
  //   }), {});
  // }

  // getSequenserGrid(instrumentUrls: any) {
  //   return Array.from(
  //     { length: 2 },
  //     () => this.convertToSequenses(instrumentUrls)
  //   );
  // }


  // todo: explain what this service is doing
  populateAllSeq(config: any) {
    if(!config?.currentInterConnection) {
      return config;
    }

    const currentInterconnectionSetting = config.interConnections[config?.currentInterConnection];
    
    const samples = Object.keys(config.samples).reduce((sum, key)=>{
      return {
        ...sum,
        [key]: {
          ...config.samples[key],
          seqs: currentInterconnectionSetting?.samples ? 
          currentInterconnectionSetting.samples[key] ? currentInterconnectionSetting.samples[key] : [] : [],
        },
      };
    }, {});

    const synths = Object.keys(config.synths).reduce((sum, key)=>{
      return {
        ...sum,
        [key]: {
          ...config.synths[key],
          seqs: currentInterconnectionSetting?.synths ? 
          currentInterconnectionSetting.synths[key] ? currentInterconnectionSetting.synths[key] : [] : [],
        },
      };
    }, {});

    return {
      ...config,
      samples,
      synths,
    };
  }
}

