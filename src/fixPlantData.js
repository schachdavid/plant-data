import { writeFileSync } from "fs";
import { stringify } from "csv-stringify/sync";
import { getPlantDataByKey } from "./utils.js";

let dict = getPlantDataByKey();

// check for neighbor conflicts and missing plants

const missingPlants = [];
let adjustedNeighbors = false;

Object.keys(dict).forEach((key) => {
  const missesInGoodNeighbors = [];
  const missesInBadNeighbors = [];
  const conflicting = [];

  // intersecting
  const intersectingPlants = dict[key].worksGoodWith.filter((value) =>
    dict[key].worksBadWith.includes(value)
  );
  if (intersectingPlants.length) {
    console.log("----------------------------");
    console.log(key);
    console.log(
      `ERROR: The following plants are good and bad neighbors: ${intersectingPlants.join(
        ", "
      )}`
    );
    return;
  }

  dict[key].worksGoodWith.forEach((goodNeighborKey) => {
    const goodNeighbor = dict[goodNeighborKey];
    if (!goodNeighbor) {
      if (!missingPlants[goodNeighborKey])
        missingPlants[goodNeighborKey] = {
          species: goodNeighborKey,
          worksBadWith: [],
          worksGoodWith: [key],
        };
      else missingPlants[goodNeighborKey].worksGoodWith.push(key);
    } else if (!goodNeighbor.worksGoodWith.includes(key)) {
      goodNeighbor.worksGoodWith.push(key);
      missesInGoodNeighbors.push(goodNeighborKey);
    } else if (goodNeighbor.worksBadWith.includes(key)) {
      conflicting.push(goodNeighborKey);
    }
  });

  dict[key].worksBadWith.forEach((badNeighborKey) => {
    const badNeighbor = dict[badNeighborKey];
    if (!badNeighbor) {
      if (!missingPlants[badNeighborKey])
        missingPlants[badNeighborKey] = {
          species: badNeighborKey,
          worksBadWith: [key],
          worksGoodWith: [],
        };
      else missingPlants[badNeighborKey].worksBadWith.push(key);
    } else if (!badNeighbor.worksBadWith.includes(key)) {
      badNeighbor.worksBadWith.push(key);
      missesInBadNeighbors.push(badNeighborKey);
    } else if (badNeighbor.worksGoodWith.includes(key)) {
      conflicting.push(badNeighborKey);
    }
  });

  if (
    missesInGoodNeighbors.length ||
    missesInBadNeighbors.length ||
    missesInBadNeighbors.length ||
    conflicting.length
  ) {
    adjustedNeighbors = true;
    console.log("----------------------------");
    console.log(key);
  }

  if (missesInGoodNeighbors.length) {
    console.log(
      `misses as a good neighbor for: ${missesInGoodNeighbors.join(", ")}`
    );
  }
  if (missesInBadNeighbors.length) {
    console.log(
      `misses as a bad neighbor for: ${missesInBadNeighbors.join(", ")}`
    );
  }
  if (conflicting.length) {
    console.log(`has neighbor conflicts with: ${conflicting.join(", ")}`);
  }
});

if (adjustedNeighbors) {
  console.log("\nAdded all missing neighbor relations.\n");
}

if (Object.keys(missingPlants)?.length) {
  console.log(
    `Entries are missing for the following plants: \n${Object.keys(
      missingPlants
    )
      .sort()
      .join("\n   ")}

Added missing entries.`
  );
  dict = { ...dict, ...missingPlants };
}

// arrays to string

let dataToSave = Object.keys(dict)
  .map((key) => dict[key])
  .map((d) =>
    Object.keys(d).reduce(
      (obj, key) => ({
        ...obj,
        [key]: Array.isArray(d[key]) ? d[key].join(", ") : d[key],
      }),
      {}
    )
  )
  // @ts-ignore
  .sort((a, b) => a.species.localeCompare(b.species));

// save adjusted csv
writeFileSync(
  "./data/plant_data.csv",
  stringify(dataToSave, {
    header: true,
    columns: {
      species: "species",
      worksGoodWith: "worksGoodWith",
      worksBadWith: "worksBadWith",
      seedingTimeInMonths: "seedingTimeInMonths",
      harvestTimeInWeeksFrom: "harvestTimeInWeeksFrom",
      harvestTimeInWeeksTo: "harvestTimeInWeeksTo",
      waterRequirement: "waterRequirement",
      fertilizerRequirement: "fertilizerRequirement",
      height: "height",
    },
  }),
  { encoding: "utf8" }
);
