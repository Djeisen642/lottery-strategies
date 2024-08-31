export abstract class GamblingStrategy {
  abstract getNextGuess(previousResult?: number): number;
}

export class RandomStrategy extends GamblingStrategy {
  constructor(private readonly _maxWinningNumber: number) {
    super();
  }

  getNextGuess(): number {
    return Math.floor(Math.random() * this._maxWinningNumber) + 1;
  }
}

export class PreviousNumberStrategy extends GamblingStrategy {
  constructor(private readonly _maxWinningNumber: number) {
    super();
  }
  getNextGuess(previousResult?: number): number {
    if (!previousResult)
      return Math.floor(Math.random() * this._maxWinningNumber) + 1;

    return previousResult;
  }
}

export class MostUsedNumberStrategy extends GamblingStrategy {
  private readonly _frequencyMap: Map<number, number> = new Map();

  constructor(private readonly _maxWinningNumber: number) {
    super();
  }

  getNextGuess(previousResult?: number): number {
    if (!previousResult && this._frequencyMap.size === 0)
      return Math.floor(Math.random() * this._maxWinningNumber) + 1;
    if (previousResult)
      this._frequencyMap.set(
        previousResult,
        (this._frequencyMap.get(previousResult) || 0) + 1
      );
    const highestFrequency = Math.max(...this._frequencyMap.values());
    const matchHighestFrequency: number[] = [];
    for (const [result, frequency] of this._frequencyMap) {
      if (frequency === highestFrequency) {
        matchHighestFrequency.push(result);
      }
    }
    if (matchHighestFrequency.length > 1) {
      const randomIndex = Math.floor(
        Math.random() * matchHighestFrequency.length
      );
      return matchHighestFrequency[randomIndex];
    }
    return matchHighestFrequency[0];
  }
}
export class LeastUsedNumberStrategy extends GamblingStrategy {
  private readonly _frequencyMap: Map<number, number> = new Map();

  constructor(private readonly _maxWinningNumber: number) {
    super();
    this._frequencyMap = new Map();
    for (let i = 1; i <= this._maxWinningNumber; i++) {
      this._frequencyMap.set(i, 0);
    }
  }

  getNextGuess(previousResult?: number): number {
    if (!previousResult && this._frequencyMap.size === 0)
      return Math.floor(Math.random() * this._maxWinningNumber) + 1;
    if (previousResult)
      this._frequencyMap.set(
        previousResult,
        (this._frequencyMap.get(previousResult) || 0) + 1
      );
    const lowestFrequency = Math.min(...this._frequencyMap.values());
    const matchLowestFrequency: number[] = [];
    for (const [result, frequency] of this._frequencyMap) {
      if (frequency === lowestFrequency) {
        matchLowestFrequency.push(result);
      }
    }
    if (matchLowestFrequency.length > 1) {
      const randomIndex = Math.floor(
        Math.random() * matchLowestFrequency.length
      );
      return matchLowestFrequency[randomIndex];
    }
    return matchLowestFrequency[0];
  }
}

export class StaticNumberStrategy extends GamblingStrategy {
  private readonly staticNumber: number;

  constructor(private readonly _maxWinningNumber: number) {
    super();
    this.staticNumber = Math.floor(Math.random() * this._maxWinningNumber) + 1;
  }

  getNextGuess(): number {
    return this.staticNumber;
  }
}

export class IncrementDecrementStrategy extends GamblingStrategy {
  private currentGuess: number;

  constructor(private readonly _maxWinningNumber: number) {
    super();
    this.currentGuess = Math.floor(Math.random() * this._maxWinningNumber) + 1;
  }

  getNextGuess(): number {
    this.currentGuess = (this.currentGuess % this._maxWinningNumber) + 1; // Increment and wrap around
    return this.currentGuess;
  }
}
