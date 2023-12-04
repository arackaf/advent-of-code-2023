import fs from "fs";

type Matrix = string[][];

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

const nonSymbols = [".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
function anyCoordinateASymbol(matrix: Matrix, coordinates: Coordinate[]): boolean {
  return coordinates.some((c) => {
    const char = matrix[c.row][c.col];
    return char !== "." && !/[0-9]/.test(char);
  });
}

function getNumbers(lineNum: number, matrix: string[][]): NumberValue[] {
  const result: NumberValue[] = [];

  const line = matrix[lineNum].join("");
  const numbersFound = line.match(/(\d+)/g) ?? [];

  for (const number of numbersFound) {
    const startingIndex = line.indexOf(number);

    result.push({
      val: +number,
      indexes: Array.from({ length: number.length }).map((_, idx) => ({ row: lineNum, col: startingIndex + idx })),
    });
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

const data = readInput();

const validNumbers = data
  .flatMap((_, idx, matrix) => getNumbers(idx, matrix))
  .filter((num) => anyCoordinateASymbol(data, getAllAdjacentCoordinates(data, num.indexes)));

const sum = validNumbers.reduce((sum, num) => sum + num.val, 0);

console.log({ sum });

// for (let i = 0; i < data.length; i++) {
//   const xxx = getNumbers(i, data).filter((num) => anyCoordinateASymbol(data, getAllAdjacentCoordinates(data, num.indexes)));
//   console.log(
//     i + 1,
//     xxx.map((x) => x.val)
//   );
// }
//const X = validNumbers.find((x) => x.val === 9)!;

//console.log(X.val);
