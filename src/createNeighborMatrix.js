import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import chalk from "chalk";

// read csv data
const csvFile = readFileSync("./data/plant_data.csv", "utf8");

function parseNeighbors(neighbors) {
  return neighbors
    .split(",")
    .map((w) => w.trim().toLowerCase())
    .filter((d) => d !== "");
}

const data = parse(csvFile, {
  columns: true,
  relax_quotes: true,
  delimiter: ",",
}).map((d) => ({
  ...d,
  species: d.species.toLowerCase(),
  worksGoodWith: parseNeighbors(d.worksGoodWith),
  worksBadWith: parseNeighbors(d.worksBadWith),
}));

const spacesBetweenColumns = 3;

const chalkEvenSpeciesColor = chalk.hex("#fffff");
const chalkUnevenSpeciesColor = chalk.hex("#9fadbf");

const chalkEvenColor = chalk.hex("#4e4e5c");
const chalkUnevenColor = chalk.hex("#383845");

const maxWordLength = Math.max(...data.map((d) => d.species.length)) + 5;

const verticals = data.map((d) =>
  fillWordWithSpaces(capitalizeFirstLetter(d.species), maxWordLength).split("")
);

for (let i = 0; i < maxWordLength; i++) {
  console.log(
    getSpaces(maxWordLength),
    " ",
    chalkEvenSpeciesColor(
      verticals
        .map((d) => (d[i] ? d[i] : " "))
        .join(getSpaces(spacesBetweenColumns))
    )
  );
}

console.log("");

data.forEach((d, i) => {
  const species = fillWordWithSpaces(
    capitalizeFirstLetter(d.species),
    maxWordLength
  );
  console.log(
    i % 2 == 0
      ? chalkEvenSpeciesColor(species)
      : chalkUnevenSpeciesColor(species),
    " ",
    data
      .map((k) =>
        d.worksGoodWith.includes(k.species)
          ? chalk.green("+")
          : d.worksBadWith.includes(k.species)
          ? chalk.red("-")
          : i % 2 == 0
          ? chalkEvenColor("o")
          : chalkUnevenColor("o")
      )
      .join(getSpaces(spacesBetweenColumns))
  );
});

console.log("\n\n\n\n");

// utils
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function fillWordWithSpaces(word, length) {
  let result = word;
  result = getSpaces(length - word.length) + result;
  return result;
}

function getSpaces(num) {
  let result = "";
  for (let i = 0; i < num; i++) {
    result = " " + result;
  }
  return result;
}
