# Plant Data

This repository contains data about different plants (data/plant_data.csv) and different scripts to process and visualize the data. It is part of the work done at the course "AWE Reallabor Smart Campus".

## Data (data/plant_data.csv)
The plant data csv file holds the following variables:

| variable | type |  description |
| -------- | --- | ---------- |
| species | text | name of the plant|
| worksGoodWith | text collection  | plants that are good neighbors |
| worksBadWith | text collection  | plants that are bad neighbors |
| seedingTimeInMonths | number collection | index of month where seeding is possible (e.g. January and February = 1,2) |
| harvestTimeInWeeksFrom | number | minimum time in weeks after seeding that is needed to harvest the plants 
| harvestTimeInWeeksTo | number | maximum time in weeks after seeding that is needed to harvest the plants
| waterRequirement | number | required water for this species on a scale of 1 to 3, 1 indicating low water requirement and 3 the highest
| fertilizerRequirement | number | required fertilizer for this species on a scale of 1 to 3, 1 indicating low fertilizer requirement and 3 the highest
| height | number | height of the plant in cm when the plant is ready to harvest

## Scripts

The following scripts provide features to process and visualize the plant data.
Make sure you have node 16 or higher installed. Setup:

```bash
npm i
```


### fix-plant-data (src/fixPlantData.js)

Checks plant_data.csv file for errors e.g. checking if all neighbor relations are bi-directional and fix these error. 

Run using:

```bash
npm run fix-plant-data
```

### check-selection (src/checkPlantSelection.js)

Checks a plant selection configured in src/config.js for compatibility.

Run using:

```bash
npm run check-selection
```

### create-neighbor-matrix (src/neighborMatrix.js)

Creates a matrix visualizing which plants are a great match.

Run using:

```bash
npm run create-neighbor-matrix
```



### evalg (src/evolutionaryAlgorithm.js)

An evolutionary alogrithm to find best matching plants to grow in a raised garden bed.

Run using:

```bash
npm run evalg
```

