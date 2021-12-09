export class Random {
  static RANDOM_INDEX_MIN = 1;
  static RANDOM_INDEX_MAX = 1_000_000_000;

  public static randomInt(low: number, high: number): number {
    // Create a random int between `low` and `high`, inclusive of both.
    return Math.floor(Math.random() * (high - low + 1) + low);
  }

  public static generateRandomSeed(): number {
    const random = Random.randomInt(
      Random.RANDOM_INDEX_MIN,
      Random.RANDOM_INDEX_MAX,
    );
    return random;
  }
}
