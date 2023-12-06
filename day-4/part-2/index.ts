import fs from "fs";

function readInput(): string[] {
  const fileContents = fs.readFileSync("../input.txt", { encoding: "utf8" });
  return fileContents.split("\n");
}

function run() {
  const input = readInput();
  const copies = Array.from({ length: input.length }, () => 1);

  input.forEach((row, idx) => {
    const { myNumbers, winningNumbers } = splitRow(row);
    const winningNumbersLookup = new Set(winningNumbers);
    const matchedNumbersCount = myNumbers.filter(num => winningNumbersLookup.has(num)).length;

    for (let i = 1; i <= copies[idx]; i++) {
      for (let j = 1, index = idx + 1; j <= matchedNumbersCount && index < copies.length; j++, index++) {
        copies[index]++;
      }
    }
  });

  const scratchCardsWon = copies.reduce((sum, numberCopies) => sum + numberCopies, 0);

  console.log({ scratchCardsWon });
}

function splitRow(str: string): { winningNumbers: number[]; myNumbers: number[] } {
  const trimmed = str.split(":")[1];

  const [winningNumbersStr, myNumbersStr] = trimmed.split("|");

  const winningNumbers = winningNumbersStr.match(/\d+/g).map(s => +s);
  const myNumbers = myNumbersStr.match(/\d+/g).map(s => +s);

  return { winningNumbers, myNumbers };
}

run();
