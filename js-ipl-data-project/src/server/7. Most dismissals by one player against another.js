// 7. Most dismissals by one player against another
const fs = require('fs');
const csv = require('csv-parser');

function findMostDismissals(filePath) {
    const dismissals = {}; // Store dismissal counts

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            const batsman = row.batsman;
            const dismissedBatsman = row.dismissal_kind === 'caught' ? row.fielder : null;

            if (dismissedBatsman) {
                if (!dismissals[batsman]) {
                    dismissals[batsman] = {};
                }

                if (!dismissals[batsman][dismissedBatsman]) {
                    dismissals[batsman][dismissedBatsman] = 1;
                } else {
                    dismissals[batsman][dismissedBatsman]++;
                }
            }
        })
        .on('end', () => {
            // Find the highest number of dismissals by one player against another
            let maxDismissals = 0;
            let mostDismissedBatsman = '';
            for (const batsman in dismissals) {
                for (const dismissedBatsman in dismissals[batsman]) {
                    const count = dismissals[batsman][dismissedBatsman];
                    if (count > maxDismissals) {
                        maxDismissals = count;
                        mostDismissedBatsman = dismissedBatsman;
                    }
                }
            }

            // Write the result to a JSON file
            fs.writeFileSync('output/mostDismissals.json', JSON.stringify({ mostDismissedBatsman, maxDismissals }, null, 2));
            console.log('Most dismissals calculated and saved in mostDismissals.json');
        });
}

// Usage
findMostDismissals('data/deliveries.csv');
