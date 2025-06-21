import { getRandomNumber } from './get-random-number.function';

export function getRandomNumberFromTextRange(txt: string): number {
  if(txt.includes('-')) {
    const fromTo = txt.split('-');
    return getRandomNumber(+fromTo[0], +fromTo[1]);
  } else {
    return +txt;
  }
}
