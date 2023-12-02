import fs from "fs";

function fileLines() {
  const fileContents = fs.readFileSync("../input.txt", { encoding: "utf8" });
  return fileContents.split("\n");
}

type NumberPosition = {
  value: string;
  index: number;
};

const validNumberStrings = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const shortestWordLength = Math.min(...validNumberStrings.map((word) => word.length));

function numberWordToValue(str: string): number {
  return validNumberStrings.indexOf(str) + 1;
}

function resolveValue(digit: string, wordVal: string): string {
  return wordVal ? numberWordToValue(wordVal).toString() : digit;
}

function getCalibrationValue(input: string): number {
  let firstDigit: NumberPosition;
  let lastDigit: NumberPosition;

  for (let i = 0; i < input.length; i++) {
    if (!Number.isNaN(Number.parseInt(input[i], 10))) {
      firstDigit = { value: input[i], index: i };
      break;
    }
  }

  for (let i = input.length - 1; i >= 0; i--) {
    if (!Number.isNaN(Number.parseInt(input[i], 10))) {
      lastDigit = { value: input[i], index: i };
      break;
    }
  }

  let leadingNumberWord = "";
  let trailingNumberWord = "";

  let leadingStringRemaining = input.slice(0, firstDigit.index);
  let trailingStringRemaining = input.slice(lastDigit.index + 1);

  if (leadingStringRemaining.length >= shortestWordLength) {
    for (const word of validNumberStrings) {
      const indexFound = leadingStringRemaining.indexOf(word);

      if (indexFound !== -1) {
        leadingNumberWord = word;
        leadingStringRemaining = leadingStringRemaining.slice(0, indexFound + word.length); // words can overlap >:-O

        if (leadingStringRemaining.length < shortestWordLength) {
          break;
        }
      }
    }
  }

  if (trailingStringRemaining.length >= shortestWordLength) {
    for (const word of validNumberStrings) {
      const indexFound = trailingStringRemaining.lastIndexOf(word);

      if (indexFound !== -1) {
        trailingNumberWord = word;
        trailingStringRemaining = trailingStringRemaining.slice(indexFound + 1);

        if (trailingStringRemaining.length < shortestWordLength) {
          break;
        }
      }
    }
  }

  let constructedCalibrationValue = resolveValue(firstDigit.value, leadingNumberWord) + resolveValue(lastDigit.value, trailingNumberWord);

  return Number.parseInt(constructedCalibrationValue, 10);
}

const lines = fileLines();
const calibrationValueSum = lines.map(getCalibrationValue).reduce((sum, val) => sum + val, 0);

console.log({ calibrationValueSum });
