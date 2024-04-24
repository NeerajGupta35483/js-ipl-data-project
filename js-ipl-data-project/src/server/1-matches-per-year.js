// 1-matches-per-year.js

const fs = require('fs');
const csv = require('csv-parser');

const matchesData = []; // Array to store match data

fs.createReadStream('data/matches.csv')
  .pipe(csv())
  .on('data', (row) => {
    matchesData.push(row);
  })
  .on('end', () => {
    const matchesPerYear = {};

    matchesData.forEach((match) => {
      const year = match.season;
      if (matchesPerYear[year]) {
        matchesPerYear[year]++;
      } else {
        matchesPerYear[year] = 1;
      }
    });

    fs.writeFileSync('output/matchesPerYear.json', JSON.stringify(matchesPerYear, null, 2));
    console.log('Matches per year data saved!');
  });
