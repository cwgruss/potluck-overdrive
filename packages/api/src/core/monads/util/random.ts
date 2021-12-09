export function randomInt(low: number, high: number): number {
  // Create a random int between `low` and `high`, inclusive of both.
  return Math.floor(Math.random() * (high - low + 1) + low);
}
