import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { getPlantData, getScore } from "./utils";

const NUMBER_OF_PLANTS = 4;

const GENERATIONS = 50;
const GENERATION_SIZE = 200;

// the number of plant selections to keep each generation
const KEEP_SIZE = GENERATION_SIZE / 10;

const data = getPlantData();

function getRandomSelection(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError(
      "getRandomSelection: more elements taken than available"
    );
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

function getRandomGeneration(data, size) {
  return Array(size)
    .fill()
    .map((_) => {
      const selection = getRandomSelection(data, NUMBER_OF_PLANTS);
      const score = getScore(selection);
      return { selection, score };
    });
}

function getRandomSpecies(data, notSpecies) {
  while (true) {
    const random = Math.floor(Math.random() * data.length);
    if (!notSpecies.includes(data[random].species)) return data[random];
  }
}

let bestSelections = [];

Array(GENERATIONS)
  .fill()
  .forEach((_, iGen) => {
    const mutatedGeneration = bestSelections.map((d) => {
      const selection = d.selection.slice();
      const randomToReplace = Math.floor(Math.random() * selection.length);
      const randomNew = getRandomSpecies(
        data,
        selection.map((s) => s.species)
      );
      Math.floor(Math.random() * data.length);
      selection[randomToReplace] = randomNew;
      const score = getScore(selection);
      return { score, selection };
    });

    const randomGeneration = getRandomGeneration(
      data,
      GENERATION_SIZE - bestSelections.length * 2
    );

    let generation = [
      ...bestSelections,
      ...mutatedGeneration,
      ...randomGeneration,
    ];

    // remove duplicates

    generation = Object.values(
      generation.reduce((prev, cur) => {
        const selection = cur.selection.slice().sort((a, b) => {
          if (a.species > b.species) return -1;
          if (b.species > a.species) return 1;
          return 0;
        });
        const key = selection.map((d) => d.species).join(";");
        return { ...prev, [key]: cur };
      }, {})
    );

    generation.sort((a, b) => {
      if (a.score > b.score) return -1;
      if (b.score > a.score) return 1;
      return 0;
    });

    bestSelections = generation.slice(0, KEEP_SIZE);
    console.log(`${iGen}. generation: ${bestSelections[0].score} score`);
  });

console.log(bestSelections.map((d) => d.selection.map((l) => l.species)));
