import fs from "fs";

type Matrix = string[][];

const matrix = readInput();

function readInput(): Matrix {
  const fileContents = fs.readFileSync("../input.txt", { encoding: "utf8" });

  const lines = fileContents.split("\n");
  return lines.map((str) => [...str]);
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

function getNumbers(lineNum: number): NumberValue[] {
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
          indexes: Array.from({ length: runningNumber.length }).map((_, idx) => ({ row: lineNum, col: startindeIndex + idx })),
        });
      }
    }
  }

  return result;
}

function getVerticallyAdjacentCoordinates(matrix: string[][], coordinate: Coordinate): Coordinate[] {
  const eligible: Coordinate[] = [
    { row: coordinate.row - 1, col: coordinate.col - 1 },
    { row: coordinate.row - 1, col: coordinate.col },
    { row: coordinate.row - 1, col: coordinate.col + 1 },

    { row: coordinate.row + 1, col: coordinate.col - 1 },
    { row: coordinate.row + 1, col: coordinate.col },
    { row: coordinate.row + 1, col: coordinate.col + 1 },
  ].filter((c) => {
    return c.row >= 0 && c.col >= 0 && c.row < matrix.length && c.col < matrix[c.row].length;
  });

  return eligible;
}
function getAllAdjacentCoordinates(matrix: string[][], coordinates: Coordinate[]): Coordinate[] {
  const allCoordiates = coordinates.flatMap((c) => getVerticallyAdjacentCoordinates(matrix, c));

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

  const unique = new Set(allCoordiates.map((c) => `${c.row}-${c.col}`));

  return [...unique].map((s) => {
    const [row, col] = s.split("-");
    return {
      row: +row,
      col: +col,
    };
  });
}

function anyCoordinateASymbol(matrix: Matrix, coordinates: Coordinate[]): boolean {
  return coordinates.some((c) => {
    const char = matrix[c.row][c.col];
    return char !== "." && !isDigit(char);
  });
}

function validNumber(num: NumberValue): boolean {
  const adjCoordinates = getAllAdjacentCoordinates(matrix, num.indexes);
  return anyCoordinateASymbol(matrix, adjCoordinates);
}

const sum = matrix
  .flatMap((_, idx) => getNumbers(idx))
  .filter(validNumber)
  .reduce((sum, num) => sum + num.val, 0);

console.log({ sum });
