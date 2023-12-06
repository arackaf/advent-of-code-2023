import fs from "fs";

function readInput(): string[] {
  const fileContents = fs.readFileSync("../input.txt", { encoding: "utf8" });
  return fileContents.split("\n");
}

function run() {
  const input = readInput();
  let winningTotal = 0;

  input.forEach(row => {
    let cardTotal = 0;

    const { myNumbers, winningNumbers } = splitRow(row);
    const winningNumbersLookup = new Set(winningNumbers);
    for (const num of myNumbers) {
      if (winningNumbersLookup.has(num)) {
        cardTotal = cardTotal * 2 || 1;
      }
    }

    winningTotal += cardTotal;
  });

  console.log({ winningTotal });
}

function splitRow(str: string): { winningNumbers: number[]; myNumbers: number[] } {
  const trimmed = str.split(":")[1];

  const [winningNumbersStr, myNumbersStr] = trimmed.split("|");

  const winningNumbers = winningNumbersStr.match(/\d+/g).map(s => +s);
  const myNumbers = myNumbersStr.match(/\d+/g).map(s => +s);

  return { winningNumbers, myNumbers };
}

run();
