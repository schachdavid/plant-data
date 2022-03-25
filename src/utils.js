import { readFileSync, writeFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

function parseNeighbors(neighbors) {
  return neighbors
    .split(",")
    .map((w) => w.trim().toLowerCase())
    .filter((d) => d !== "");
}

/**
 * @typedef {Object} PlantData
 * @property {string} species
 * @property {string[]} worksGoodWith
 * @property {string[]} worksBadWith
 * @property {number} seedingTimeInMonths
 * @property {number} harvestTimeInWeeksFrom
 * @property {number} harvestTimeInWeeksTo
 * @property {number} waterRequirement
 * @property {number} fertilizerRequirement
 * @property {number} height
 */

/**
 * @returns {PlantData[]}
 */
export function getPlantData() {
  const csvFile = readFileSync("./data/plant_data.csv", "utf8");
  return parse(csvFile, {
    columns: true,
    relax_quotes: true,
    delimiter: ",",
  }).map((d) => ({
    ...d,
    species: d.species.toLowerCase(),
    worksGoodWith: parseNeighbors(d.worksGoodWith),
    worksBadWith: parseNeighbors(d.worksBadWith),
  }));
}

// fitness function
export function getScore(selection) {
  return selection.reduce(
    (prev, cur) =>
      prev +
      -1 *
        selection.filter((d) => cur.worksBadWith.includes(d.species)).length +
      selection.filter((d) => cur.worksGoodWith.includes(d.species)).length,
    0
  );
}

export function getPlantDataByKey() {
  return getPlantData().reduce(
    (dict, el) => ({ ...dict, [el.species]: { ...el } }),
    {}
  );
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
