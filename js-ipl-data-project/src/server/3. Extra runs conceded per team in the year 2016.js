// 3. Extra runs conceded per team in the year 2016
const fs = require('fs');
const csv = require('csv-parser');
const filePath='data/deliveries.csv'

function calculateExtraRunsConceded(filePath) {
    const extraRunsPerTeam = {};

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            const matchId = row.match_id;
            const season = row.season;
            const team = row.bowling_team;
            const extraRuns = parseInt(row.extra_runs);

            if (season === '2016') {
                if (!extraRunsPerTeam[team]) {
                    extraRunsPerTeam[team] = extraRuns;
                } else {
                    extraRunsPerTeam[team] += extraRuns;
                }
            }
        })
        .on('end', () => {
            // Write the result to a JSON file
            fs.writeFileSync('output/extraRunsConceded2016.json', JSON.stringify(extraRunsPerTeam, null, 2));
            console.log('Extra runs per team in 2016 calculated and saved in extraRunsConceded2016.json');
        });
}

// Usage
calculateExtraRunsConceded('data/deliveries.csv');
