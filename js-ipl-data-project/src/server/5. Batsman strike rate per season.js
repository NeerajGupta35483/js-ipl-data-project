// 5. Batsman strike rate per season
const fs = require('fs');
const csv = require('csv-parser');

function calculateBatsmanStrikeRate(filePath) {
    const batsmanStats = {}; // Store batsman-wise stats

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            const season = row.season;
            const batsman = row.batsman;
            const runs = parseInt(row.total_runs);
            const ballsFaced = parseInt(row.batsman_runs);

            if (season) {
                if (!batsmanStats[season]) {
                    batsmanStats[season] = {};
                }

                if (!batsmanStats[season][batsman]) {
                    batsmanStats[season][batsman] = {
                        runs,
                        ballsFaced,
                    };
                } else {
                    batsmanStats[season][batsman].runs += runs;
                    batsmanStats[season][batsman].ballsFaced += ballsFaced;
                }
            }
        })
        .on('end', () => {
            // Calculate strike rate for each batsman in each season
            const batsmanStrikeRatePerSeason = {};
            for (const season in batsmanStats) {
                batsmanStrikeRatePerSeason[season] = [];
                for (const batsman in batsmanStats[season]) {
                    const { runs, ballsFaced } = batsmanStats[season][batsman];
                    const strikeRate = (runs / ballsFaced) * 100;
                    batsmanStrikeRatePerSeason[season].push({ batsman, strikeRate });
                }
            }

            // Write the result to a JSON file
            fs.writeFileSync('output/batsmanStrikeRatePerSeason.json', JSON.stringify(batsmanStrikeRatePerSeason, null, 2));
            console.log('Batsman strike rate per season calculated and saved in batsmanStrikeRatePerSeason.json');
        });
}

// Usage
calculateBatsmanStrikeRate('data/deliveries.csv');
