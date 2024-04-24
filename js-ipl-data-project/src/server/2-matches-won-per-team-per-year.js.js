// 2-matches-won-per-team-per-year.js

const fs = require('fs');
const csv = require('csv-parser');


function getMatchesWonPerTeamPerYear(matchesFilePath) {
    const matchesWonPerTeamPerYear = {};

    fs.createReadStream(matchesFilePath)
        .pipe(csv())
        .on('data', (row) => {
            const year = row['season'];
            const winner = row['winner'];

            if (winner) {
                if (!matchesWonPerTeamPerYear[year]) {
                    matchesWonPerTeamPerYear[year] = {};
                }

                if (matchesWonPerTeamPerYear[year][winner]) {
                    matchesWonPerTeamPerYear[year][winner]++;
                } else {
                    matchesWonPerTeamPerYear[year][winner] = 1;
                }
            }
        })
        .on('end', () => {
            fs.writeFileSync('output/matchesWonPerTeamPerYear.json', JSON.stringify(matchesWonPerTeamPerYear, null, 2));
            console.log('Matches won per team per year data saved to matchesWonPerTeamPerYear.json');
        });
}

getMatchesWonPerTeamPerYear('data/matches.csv');
