//helper
export function getRandomNumber(from: number, to: number): number {
  return Math.round(Math.random() * (to - from) + from);
}
