// 6. Player with most Player of the Match awards per season
const fs = require('fs');
const csv = require('csv-parser');

function findMostValuablePlayer(filePath) {
    const playerAwards = {}; // Store player-wise awards

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            const season = row.season;
            const playerOfTheMatch = row.player_of_the_match;

            if (season && playerOfTheMatch) {
                if (!playerAwards[season]) {
                    playerAwards[season] = {};
                }

                if (!playerAwards[season][playerOfTheMatch]) {
                    playerAwards[season][playerOfTheMatch] = 1;
                } else {
                    playerAwards[season][playerOfTheMatch]++;
                }
            }
        })
        .on('end', () => {
            // Find the player with the most awards in each season
            const mostValuablePlayersPerSeason = {};
            for (const season in playerAwards) {
                const players = Object.keys(playerAwards[season]);
                const mostAwards = Math.max(...players.map((player) => playerAwards[season][player]));
                const mostValuablePlayer = players.find((player) => playerAwards[season][player] === mostAwards);
                mostValuablePlayersPerSeason[season] = mostValuablePlayer;
            }

            // Write the result to a JSON file
            fs.writeFileSync('output/mostValuablePlayersPerSeason.json', JSON.stringify(mostValuablePlayersPerSeason, null, 2));
            console.log('Most valuable player per season calculated and saved in mostValuablePlayersPerSeason.json');
        });
}

// Usage
findMostValuablePlayer('data/matches.csv');
