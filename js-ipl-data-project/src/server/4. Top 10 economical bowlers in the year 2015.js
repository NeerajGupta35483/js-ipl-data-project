// 4. Top 10 economical bowlers in the year 2015
const fs = require('fs');
const csv = require('csv-parser');

function findTopEconomicalBowlers(filePath) {
    const bowlerStats = {}; // Store bowler-wise stats

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            const season = row.season;
            const bowler = row.bowler;
            const totalRuns = parseInt(row.total_runs);
            const extras = parseInt(row.extra_runs);
            const ballsBowled = row.is_super_over === '0' ? 1 : 0; // Exclude super overs

            if (season === '2015') {
                if (!bowlerStats[bowler]) {
                    bowlerStats[bowler] = {
                        runs: totalRuns + extras,
                        balls: ballsBowled,
                    };
                } else {
                    bowlerStats[bowler].runs += totalRuns + extras;
                    bowlerStats[bowler].balls += ballsBowled;
                }
            }
        })
        .on('end', () => {
            // Calculate economy rate for each bowler
            const economicalBowlers = Object.keys(bowlerStats)
                .map((bowler) => {
                    const { runs, balls } = bowlerStats[bowler];
                    const economyRate = (runs / balls) * 6; // Economy rate per over
                    return { bowler, economyRate };
                })
                .sort((a, b) => a.economyRate - b.economyRate)
                .slice(0, 10); // Top 10 bowlers

            // Write the result to a JSON file
            fs.writeFileSync('output/topEconomicalBowlers2015.json', JSON.stringify(economicalBowlers, null, 2));
            console.log('Top 10 economical bowlers in 2015 calculated and saved in topEconomicalBowlers2015.json');
        });
}

// Usage
findTopEconomicalBowlers('data/deliveries.csv');
