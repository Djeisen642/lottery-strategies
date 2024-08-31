import {
  GamblingStrategy,
  RandomStrategy,
  PreviousNumberStrategy,
  StaticNumberStrategy,
  IncrementDecrementStrategy,
  MostUsedNumberStrategy,
  LeastUsedNumberStrategy,
} from '../strategies';

describe('GamblingStrategies', () => {
  const maxWinningNumber = 10;

  describe('RandomStrategy', () => {
    let strategy: GamblingStrategy;

    beforeEach(() => {
      strategy = new RandomStrategy(maxWinningNumber);
    });

    it('should generate a random number within the specified range', () => {
      const guess = strategy.getNextGuess();
      expect(guess).toBeGreaterThanOrEqual(1);
      expect(guess).toBeLessThanOrEqual(maxWinningNumber);
    });
  });

  describe('PreviousNumberStrategy', () => {
    let strategy: GamblingStrategy;

    beforeEach(() => {
      strategy = new PreviousNumberStrategy(maxWinningNumber);
    });

    it('should return a random number on the first guess', () => {
      const guess = strategy.getNextGuess();
      expect(guess).toBeGreaterThanOrEqual(1);
      expect(guess).toBeLessThanOrEqual(maxWinningNumber);
    });

    it('should return the previous result on subsequent guesses', () => {
      const previousResult = 5;
      strategy.getNextGuess(); // Make a first guess to set the previous result
      const guess = strategy.getNextGuess(previousResult);
      expect(guess).toBe(previousResult);
    });
  });

  describe('StaticNumberStrategy', () => {
    let strategy: GamblingStrategy;

    beforeEach(() => {
      strategy = new StaticNumberStrategy(maxWinningNumber);
    });

    it('should always return the same number', () => {
      const firstGuess = strategy.getNextGuess();
      const secondGuess = strategy.getNextGuess();
      expect(firstGuess).toBe(secondGuess);
    });
  });

  describe('IncrementDecrementStrategy', () => {
    let strategy: GamblingStrategy;

    beforeEach(() => {
      strategy = new IncrementDecrementStrategy(maxWinningNumber);
    });

    it('should increment the guess and wrap around', () => {
      let previousGuess = strategy.getNextGuess();
      for (let i = 0; i < maxWinningNumber * 2; i++) {
        const currentGuess = strategy.getNextGuess();
        expect(currentGuess).toBe((previousGuess % maxWinningNumber) + 1);
        previousGuess = currentGuess;
      }
    });
  });

  describe('MostUsedNumberStrategy', () => {
    let strategy: GamblingStrategy;

    beforeEach(() => {
      strategy = new MostUsedNumberStrategy(maxWinningNumber);
    });

    it('should return the most used number', () => {
      const mostUsedNumber = 5;
      for (let i = 0; i < 10; i++) {
        strategy.getNextGuess(mostUsedNumber);
      }
      const guess = strategy.getNextGuess();
      expect(guess).toBe(mostUsedNumber);
    });
  });
  describe('LeastUsedNumberStrategy', () => {
    let strategy: GamblingStrategy;

    beforeEach(() => {
      strategy = new LeastUsedNumberStrategy(maxWinningNumber);
    });

    it('should return the least used number', () => {
      const leastUsedNumber = 5;
      for (let i = 1; i <= maxWinningNumber; i++) {
        if (i !== leastUsedNumber) {
          strategy.getNextGuess(i);
        }
      }
      const guess = strategy.getNextGuess();
      expect(guess).toBe(leastUsedNumber);
    });
  });
});
