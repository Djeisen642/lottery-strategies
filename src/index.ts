import {
  type GamblingStrategy,
  RandomStrategy,
  PreviousNumberStrategy,
  StaticNumberStrategy,
  IncrementDecrementStrategy,
  MostUsedNumberStrategy,
  LeastUsedNumberStrategy,
} from './strategies';

class Gambler {
  private strategy: GamblingStrategy;

  constructor(strategy: GamblingStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: GamblingStrategy): void {
    this.strategy = strategy;
  }

  placeGuess(previousResult?: number): number {
    return this.strategy.getNextGuess(previousResult);
  }
}

// Function to simulate gambling until a win with a changing winning number
function gambleUntilWin(gambler: Gambler, maxWinningNumber: number): number {
  let numGuesses = 0;
  let currentGuess = 0;
  let winningNumber: number | undefined = undefined;

  do {
    currentGuess = gambler.placeGuess(winningNumber);
    numGuesses++;
    winningNumber = Math.floor(Math.random() * maxWinningNumber) + 1; // Generate a new winning number
  } while (currentGuess !== winningNumber);

  return numGuesses;
}

// Function to calculate quartiles from a sorted array
function calculateQuartiles(data: number[]): {
  q1: number;
  q2: number;
  q3: number;
} {
  const n = data.length;
  const sortedData = data.toSorted((a, b) => a - b); // Sort a copy of the data

  const getMedian = (start: number, end: number): number => {
    const middle = Math.floor((start + end) / 2);
    return (start + end) % 2 === 0
      ? (sortedData[middle - 1] + sortedData[middle]) / 2
      : sortedData[middle];
  };

  const q2 = getMedian(0, n - 1); // Median of the entire data

  const q1 = getMedian(0, Math.floor((n - 1) / 2)); // Median of the lower half
  const q3 = getMedian(Math.ceil(n / 2), n - 1); // Median of the upper half

  return { q1, q2, q3 };
}

type StrategyStats = {
  averageGuesses: number;
  minGuesses: number;
  maxGuesses: number;
  standardDeviation: number;
  quartiles: { q1: number; q2: number; q3: number };
};

// Function to run simulations and calculate various statistics
function runSimulations(
  strategy: GamblingStrategy,
  maxWinningNumber: number,
  numSimulations: number = 1000
): StrategyStats {
  const totalGuesses = [];

  for (let i = 0; i < numSimulations; i++) {
    const gambler = new Gambler(strategy);
    const guessesToWin = gambleUntilWin(gambler, maxWinningNumber);
    totalGuesses.push(guessesToWin);
  }

  totalGuesses.sort((a, b) => a - b); // Sort for quartile calculation

  const averageGuesses =
    totalGuesses.reduce((sum, guesses) => sum + guesses, 0) / numSimulations;

  const minGuesses = totalGuesses[0]; // Min from sorted array
  const maxGuesses = totalGuesses[totalGuesses.length - 1]; // Max from sorted array

  // Calculate standard deviation
  const squaredDifferencesSum = totalGuesses.reduce(
    (sum, guesses) => sum + Math.pow(guesses - averageGuesses, 2),
    0
  );
  const standardDeviation = Math.sqrt(squaredDifferencesSum / numSimulations);

  // Calculate quartiles
  const quartiles = calculateQuartiles(totalGuesses);

  return {
    averageGuesses,
    minGuesses,
    maxGuesses,
    standardDeviation,
    quartiles,
  };
}

// Example usage:
const maxWinningNumber = 10;
const numSimulations = 100000;

const randomStrategy = new RandomStrategy(maxWinningNumber);
const previousNumberStrategy = new PreviousNumberStrategy(maxWinningNumber);
const staticNumberStrategy = new StaticNumberStrategy(maxWinningNumber);
const incrementDecrementStrategy = new IncrementDecrementStrategy(
  maxWinningNumber
);
const mostUsedNumberStrategy = new MostUsedNumberStrategy(maxWinningNumber);
const leastUsedNumberStrategy = new LeastUsedNumberStrategy(maxWinningNumber);

const strategies = [
  { name: 'Random', strategy: randomStrategy },
  { name: 'Previous Number', strategy: previousNumberStrategy },
  { name: 'Static Number', strategy: staticNumberStrategy },
  { name: 'Increment/Decrement', strategy: incrementDecrementStrategy },
  { name: 'Most Used Number', strategy: mostUsedNumberStrategy },
  { name: 'Least Used Number', strategy: leastUsedNumberStrategy },
];

let winningStrategyName: string | undefined;
let winningStrategyStats: StrategyStats | undefined;

for (const { name, strategy } of strategies) {
  const stats = runSimulations(strategy, maxWinningNumber, numSimulations);
  console.log(`--- ${name} Strategy ---`);
  console.log(`Average Guesses: ${stats.averageGuesses.toFixed(2)}`);
  console.log(`Min Guesses: ${stats.minGuesses}`);
  console.log(`Max Guesses: ${stats.maxGuesses}`);
  console.log(`Standard Deviation: ${stats.standardDeviation.toFixed(2)}`);
  console.log(
    `Quartiles: Q1=${stats.quartiles.q1}, Q2=${stats.quartiles.q2}, Q3=${stats.quartiles.q3}`
  );

  console.log('\n');
  if (
    !winningStrategyStats ||
    stats.averageGuesses < winningStrategyStats.averageGuesses
  ) {
    winningStrategyName = name;
    winningStrategyStats = stats;
  }
}

console.log(`--- Winning Strategy ---`);
console.log(`Strategy: ${winningStrategyName}`);
