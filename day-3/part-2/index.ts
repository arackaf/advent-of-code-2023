import fs from "fs";

type Matrix = string[][];

function readInput(): Matrix {
  const fileContents = fs.readFileSync("../input.txt", { encoding: "utf8" });

  const lines = fileContents.split("\n");
  return lines.map(str => [...str]);
}

type Coordinate = {
  row: number;
  col: number;
};

type NumberValue = {
  val: number;
  indexes: Coordinate[];
};

const isDigit = (char: string) => /[0-9]/.test(char);

function fillLineLookup(lineNum: number) {
  const result: NumberValue[] = [];

  let parsingNumber = false;
  let runningNumber = "";
  let startindeIndex = 0;

  const line = matrix[lineNum].join("");

  for (let i = 0; i < line.length; i++) {
    if (isDigit(line[i])) {
      if (parsingNumber) {
        runningNumber += line[i];
      } else {
        parsingNumber = true;
        startindeIndex = i;
        runningNumber = line[i];
      }
    }
    if (!isDigit(line[i]) || i === line.length - 1) {
      if (parsingNumber) {
        parsingNumber = false;
        result.push({
          val: +runningNumber,
          indexes: Array.from({ length: runningNumber.length }).map((_, idx) => ({
            row: lineNum,
            col: startindeIndex + idx,
          })),
        });
      }
    }
  }

  lineNumberLookup.set(lineNum, result);
}

function getVerticallyAdjacentCoordinates(matrix: string[][], coordinate: Coordinate): Coordinate[] {
  const eligible: Coordinate[] = [
    { row: coordinate.row - 1, col: coordinate.col - 1 },
    { row: coordinate.row - 1, col: coordinate.col },
    { row: coordinate.row - 1, col: coordinate.col + 1 },

    { row: coordinate.row + 1, col: coordinate.col - 1 },
    { row: coordinate.row + 1, col: coordinate.col },
    { row: coordinate.row + 1, col: coordinate.col + 1 },
  ].filter(c => {
    return c.row >= 0 && c.col >= 0 && c.row < matrix.length && c.col < matrix[c.row].length;
  });

  return eligible;
}
function getAllAdjacentCoordinates(matrix: string[][], coordinates: Coordinate[]): Coordinate[] {
  const allCoordiates = coordinates.flatMap(c => getVerticallyAdjacentCoordinates(matrix, c));

  const firstCoordinate = coordinates[0];
  const lastCoordinate = coordinates.at(-1);

  if (firstCoordinate.col > 0) {
    allCoordiates.push({
      row: firstCoordinate.row,
      col: firstCoordinate.col - 1,
    });
  }
  if (lastCoordinate.col < matrix[lastCoordinate.row].length - 1) {
    allCoordiates.push({
      row: lastCoordinate.row,
      col: lastCoordinate.col + 1,
    });
  }

  const unique = new Set(allCoordiates.map(c => `${c.row}-${c.col}`));

  return [...unique].map(s => {
    const [row, col] = s.split("-");
    return {
      row: +row,
      col: +col,
    };
  });
}

const matrix = readInput();
const lineNumberLookup = new Map<number, NumberValue[]>();
for (let i = 0; i < matrix.length; i++) {
  fillLineLookup(i);
}

let gearRatioSums = 0;
matrix.forEach((chars, rowNum) => {
  let line = chars.join("");

  const candidateLines: number[] = [rowNum];
  if (rowNum > 0) {
    candidateLines.push(rowNum - 1);
  }
  if (rowNum < matrix.length - 1) {
    candidateLines.push(rowNum + 1);
  }

  for (let i = 0; i < line.length; i++) {
    if (line[i] === "*") {
      const allAdjacentNumbers = candidateLines
        .flatMap(lineNum => lineNumberLookup.get(lineNum) ?? [])
        .filter(num => getAllAdjacentCoordinates(matrix, num.indexes).some(coord => coord.col === i && coord.row === rowNum))
        .map(num => ({ val: num.val }));

      if (allAdjacentNumbers.length === 2) {
        gearRatioSums += allAdjacentNumbers[0].val * allAdjacentNumbers[1].val;
      }
    }
  }
});

console.log({ gearRatioSums });
