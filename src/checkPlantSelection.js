import { findBestMatch } from "string-similarity";
import { plantSelectionsToCheck } from "./config.js";
import { capitalizeFirstLetter, getPlantDataByKey } from "./utils.js";
import chalk from "chalk";

const dict = getPlantDataByKey();

plantSelectionsToCheck.forEach(checkPlantSelection);

function checkPlantSelection(selection) {
  const plants = selection
    .map((p) => {
      const entry = dict[p.toLowerCase()];
      if (entry) return entry;
      const bestMatch = findBestMatch(p, Object.keys(dict)).bestMatch;
      console.log(
        chalk.yellow(`WARN: No entry found for ${capitalizeFirstLetter(p)}`)
      );
      if (bestMatch.rating > 0.4) {
        console.log(
          `    Using ${capitalizeFirstLetter(bestMatch.target)} instead.`
        );
        return dict[bestMatch.target];
      }
      console.log(
        chalk.red("    ERROR: No suitable Replacement found"),
        `(Most likely replacement: ${capitalizeFirstLetter(bestMatch.target)})`
      );
    })
    .filter((p) => p !== undefined);
  console.log("\n\n");

  const plantNames = plants.map((p) => p.species);

  let goodCombinations = [];
  let badCombinations = [];

  plants.forEach((p) => {
    goodCombinations = goodCombinations.concat(
      p.worksGoodWith
        .filter((n) => plantNames.includes(n))
        .map((n) =>
          [capitalizeFirstLetter(p.species), capitalizeFirstLetter(n)]
            .sort()
            .join(" und ")
        )
    );

    badCombinations = badCombinations.concat(
      p.worksBadWith
        .filter((n) => plantNames.includes(n))
        .map((n) =>
          [capitalizeFirstLetter(p.species), capitalizeFirstLetter(n)]
            .sort()
            .join(" und ")
        )
    );
  });

  // deduplicate

  // @ts-ignore
  goodCombinations = [...new Set(goodCombinations)];
  // @ts-ignore
  badCombinations = [...new Set(badCombinations)];

  if (goodCombinations.length) {
    console.log(
      "Good neighbors:",
      goodCombinations.map((d) => chalk.green("\n+ ") + d).join()
    );
  }
  console.log("\n");

  if (badCombinations.length) {
    console.log(
      "Bad neighbors:",
      badCombinations.map((d) => chalk.red("\n- ") + d).join()
    );
  }
  console.log("\n");
}
