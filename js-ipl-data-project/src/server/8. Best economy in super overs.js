// 8. Best economy in super overs
const fs = require('fs');
const csv = require('csv-parser');

function calculateBestEconomyInSuperOvers(filePath) {
    const superOversData = {}; // Store super over data

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            const isSuperOver = row.is_super_over === '1';
            const bowler = row.bowler;
            const totalRuns = parseInt(row.total_runs);
            const ballsBowled = isSuperOver ? 1 : 0; // Exclude non-super over deliveries

            if (isSuperOver) {
                if (!superOversData[bowler]) {
                    superOversData[bowler] = {
                        runs: totalRuns,
                        balls: ballsBowled,
                    };
                } else {
                    superOversData[bowler].runs += totalRuns;
                    superOversData[bowler].balls += ballsBowled;
                }
            }
        })
        .on('end', () => {
            // Calculate economy rate for each bowler in super overs
            const bowlerEconomy = {};
            for (const bowler in superOversData) {
                const { runs, balls } = superOversData[bowler];
                const economyRate = (runs / balls) * 6; // Economy rate per over
                bowlerEconomy[bowler] = economyRate;
            }

            // Find the bowler with the best economy
            const bestEconomyBowler = Object.keys(bowlerEconomy).reduce((a, b) => (bowlerEconomy[a] < bowlerEconomy[b] ? a : b));

            // Save the result to a JSON file
            const result = {
                bestEconomyBowler,
                economyRate: bowlerEconomy[bestEconomyBowler].toFixed(2),
            };
            fs.writeFileSync('output/bestEconomyInSuperOvers.json', JSON.stringify(result, null, 2));
            console.log('Best economy in super overs calculated and saved in bestEconomyInSuperOvers.json');
        });
}

// Usage
calculateBestEconomyInSuperOvers('data/deliveries.csv');
