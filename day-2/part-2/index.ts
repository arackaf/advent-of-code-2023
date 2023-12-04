import fs from "fs";

type GameRound = {
  blue?: number;
  red?: number;
  green?: number;
};

type Game = {
  id: number;
  rounds: GameRound[];
};

function parseGame(input: string): Game {
  const [gameIdString, roundsString] = input.split(":");

  const match = gameIdString.match(/Game (\d+)/);
  const gameId = +match[1];

  const rounds = roundsString.split(";");

  const roundsObjects = rounds.map(round => {
    const entries = round.match(/\d+ (red|green|blue)/g);
    const values = entries.map(entry => {
      const [, val, color] = entry.match(/(\d+) (red|blue|green)/);
      return `"${color}": ${val}`;
    });

    return `{ ${values.join(", ")} }`;
  });

  return {
    id: gameId,
    rounds: roundsObjects.map(str => JSON.parse(str)),
  };
}

function readInput(): Game[] {
  const fileContents = fs.readFileSync("../input.txt", { encoding: "utf8" });
  return fileContents.split("\n").map(parseGame);
}

const redConstrint = 12;
const greenConstrint = 13;
const blueConstrint = 14;

function gameRoundPossible(round: GameRound): boolean {
  return (
    (round.blue == null || round.blue <= blueConstrint) &&
    (round.green == null || round.green <= greenConstrint) &&
    (round.red == null || round.red <= redConstrint)
  );
}

function power(g: Game): number {
  const blues: number[] = [];
  const greens: number[] = [];
  const reds: number[] = [];

  g.rounds.forEach(r => {
    reds.push(r.red ?? 0);
    greens.push(r.green ?? 0);
    blues.push(r.blue ?? 0);
  });

  const minRed = Math.max(...reds);
  const minGreen = Math.max(...greens);
  const minBlue = Math.max(...blues);

  return minRed * minGreen * minBlue;
}

const data = readInput();

const sum = data.map(power).reduce((sum, powerVal) => sum + powerVal, 0);

console.log({ sum });
