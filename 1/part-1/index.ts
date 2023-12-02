import fs from "fs";

function fileLines() {
  const fileContents = fs.readFileSync("./input.txt", { encoding: "utf8" });
  return fileContents.split("\n");
}

function getCalibrationValue(input: string): number {
  let constructedCalibrationValue: string = "";

  for (let i = 0; i < input.length; i++) {
    if (!Number.isNaN(Number.parseInt(input[i], 10))) {
      constructedCalibrationValue = input[i];
      break;
    }
  }

  for (let i = input.length - 1; i >= 0; i--) {
    if (!Number.isNaN(Number.parseInt(input[i], 10))) {
      constructedCalibrationValue += input[i];
      break;
    }
  }

  return Number.parseInt(constructedCalibrationValue, 10);
}

const lines = fileLines();
const calibrationValueSum = lines.map(getCalibrationValue).reduce((sum, val) => sum + val, 0);

console.log({ calibrationValueSum });
