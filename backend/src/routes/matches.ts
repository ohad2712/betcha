import { Router } from 'express';
import axios from 'axios';
import moment from 'moment-timezone';
import cron from 'node-cron';

import { Match } from '../models/match';
import { authenticate } from '../middleware/authenticate';
import { Guess } from '../models/guess';
import { getLatestActiveGameweekId } from '../utils';

const router = Router();

// TODO: add return type to functions

router.get('/upcoming', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id!;
    const gameweekId = await getLatestActiveGameweekId();

    if (!gameweekId) {
      return res.status(500).json({ error: 'Failed to retrieve the latest active gameweek' });
    }

    // Check if the matches for this gameweek are already cached
    const cachedMatches = await Match.findAll({ where: { gameweekId } });

    if (cachedMatches.length > 0) {
      const groupedMatches = groupMatchesByKickoffTime(cachedMatches);

      // Schedule cronjobs for each kickoff time
      scheduleResultUpdateCronjobs({ userId, gameweekId }, groupedMatches);
      
      return res.json(groupedMatches);
    }

    // // Fetch upcoming matches for the gameweek from the API
    // const response = await axios.get(`${process.env.API_FOOTBALL_URL}/fixtures`, {
    //   params: {
    //     league: process.env.LEAGUE_CODE,
    //     season: process.env.SEASON,
    //     round: `Regular Season - ${gameweekId}`,
    //     timezone: 'Asia/Jerusalem',
    //   },
    //   headers: {
    //     'x-apisports-key': process.env.FOOTBALL_API_KEY,
    //   },
    // });

    // const response = {
    //   "data": {
    //     "response": [
    //       {
    //         "fixture": {
    //           "id": 111111,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T14:00:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 1,
    //             "name": "Liverpool",
    //             "logo": "https://media.api-sports.io/football/teams/1.png",
    //             "winner": true
    //           },
    //           "away": {
    //             "id": 2,
    //             "name": "Manchester United",
    //             "logo": "https://media.api-sports.io/football/teams/2.png",
    //             "winner": false
    //           }
    //         }
    //       },
    //       {
    //         "fixture": {
    //           "id": 222222,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T14:00:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 3,
    //             "name": "Chelsea",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "Arsenal",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         }
    //       },
    //       {
    //         "fixture": {
    //           "id": 333333,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T14:00:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 4,
    //             "name": "Aston Villa",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "Wolves",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         }
    //       },
    //       {
    //         "fixture": {
    //           "id": 444444,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T14:00:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 3,
    //             "name": "Bournemouth",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "West Ham United",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         }
    //       },
    //       {
    //         "fixture": {
    //           "id": 555555,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T14:00:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 3,
    //             "name": "Brighton",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "Tottenham Hotspurs",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         }
    //       },
    //       {
    //         "fixture": {
    //           "id": 666666,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T14:00:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 3,
    //             "name": "Crystal Palace",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "Southampton",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         }
    //       },
    //       {
    //         "fixture": {
    //           "id": 777777,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T14:00:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 3,
    //             "name": "Everton",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "Nottingham Forest",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         }
    //       },
    //       {
    //         "fixture": {
    //           "id": 888888,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-07T18:30:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 3,
    //             "name": "Fulham",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "Newcastle United",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         }
    //       },
    //       {
    //         "fixture": {
    //           "id": 999999,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T19:30:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 3,
    //             "name": "Ipswich",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "Manchester City",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         }
    //       },
    //       {
    //         "fixture": {
    //           "id": 101101,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T17:00:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 3,
    //             "name": "Leicester City",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "Brentford",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         }
    //       },
    //     ]
    //   }
    // };

    const now = new Date();            // Get the current date and time
    now.setSeconds(now.getSeconds() + 30); // Add 30 seconds to the current time to allow time to guess before locking the game

    const formattedDate = now.toISOString(); // TODO: remove once tests are done against real API
    
    const response = {
      "data": {
        "response": [
          {
            "fixture": {
              "id": 111111,
              "referee": null,
              "timezone": "UTC",
              "date": formattedDate,
              "timestamp": 1580997600,
              "periods": {},
              "venue": {},
              "status": {}
            },
            "teams": {
              "home": {
                "id": 1,
                "name": "Liverpool",
                "logo": "https://media.api-sports.io/football/teams/1.png",
                "winner": true
              },
              "away": {
                "id": 2,
                "name": "Manchester United",
                "logo": "https://media.api-sports.io/football/teams/2.png",
                "winner": false
              }
            },
            "goals": {
              "home": 7,
              "away": 0
            },
          },
          
        ]
      }
    };

    const matchesData = response.data.response;
    
    // Map the API data to your Match model
    const matches = matchesData.map((data: any) => ({
      gameweekId,
      homeTeam: data.teams.home.name,
      awayTeam: data.teams.away.name,
      homeGoals: 0,
      awayGoals: 0,
      kickoffTime: moment(data.fixture.date).tz('Asia/Jerusalem').add(1, 'hour').toDate(), // Change back to the commented part below after tests are done (this is only to not lock the game guessing input)
      // moment(data.fixture.date).tz('Asia/Jerusalem').toDate(),
      matchId: data.fixture.id,
    }));
    
    // Save the matches to the cache (database)
    const savedMatches = await Match.bulkCreate(matches);
      
    const groupedMatches = groupMatchesByKickoffTime(savedMatches);    

    // Schedule cronjobs for each kickoff time
    scheduleResultUpdateCronjobs({ userId, gameweekId }, groupedMatches);

    res.json(groupedMatches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Helper function to group matches by kickoffTime
function groupMatchesByKickoffTime(matches: Match[]) {
  // Group by formatted kickoffTime string (e.g., "2025-02-06T14:00:00+00:00")
  const groupedMatches: { [key: string]: Match[] } = {};

  matches.forEach((match) => {
    const kickoffTimeKey = match.kickoffTime.toISOString();

    if (!groupedMatches[kickoffTimeKey]) {
      groupedMatches[kickoffTimeKey] = [];
    }

    groupedMatches[kickoffTimeKey].push(match);
  });

  // Convert to array of objects sorted by kickoffTime
  const sortedGroupedMatches = Object.keys(groupedMatches)
    .sort()
    .map((key) => ({
      kickoffTime: key,
      matches: groupedMatches[key],
    }));

  return sortedGroupedMatches;
}

// Helper function to schedule cronjobs
function scheduleResultUpdateCronjobs(
  guessIdentifiers: {userId: number, gameweekId: number }, 
  groupedMatches: { kickoffTime: string, matches: Match[] }[]
) {  
  groupedMatches.forEach(group => {
    const kickoffTimeInIsrael = moment.tz(group.kickoffTime, 'Asia/Jerusalem');
    
    const scheduleTime = kickoffTimeInIsrael.add(1, 'minute').subtract(1, 'hour'); // TODO: remove this line after testing (adding one minute to give time to put guess, and remove the temporary +1 hour that's done to prevent locking the guess input)
    // const scheduleTime = kickoffTimeInIsrael.add(2, 'hours'); // 2 hours after the kick-off time
    
    const cronExpression = `${scheduleTime.seconds()} ${scheduleTime.minutes()} ${scheduleTime.hours()} ${scheduleTime.date()} ${scheduleTime.month() + 1} *`;
    
    cron.schedule(cronExpression, async () => {
      try {
        console.log("In cron callback", moment.tz((new Date()).toISOString(), 'Asia/Jerusalem'));
        
        await updateMatchResults(guessIdentifiers, group.matches);
      } catch (error) {
        console.error(`Failed to update results for matches starting at ${group.kickoffTime}`, error);
      }
    }, {
      timezone: "Asia/Jerusalem"
    });
  });
}

const updateMatchResults = async (guessIdentifiers: {userId: number, gameweekId: number }, matches: Match[]) => {  
  const goalsMap = await getMatchesUpdatedData(matches);

  for (const matchId in goalsMap) {
    try {
      const match = await Match.findOne({ where: { matchId: Number(matchId) } });
      
      if (match) {
        match.homeGoals = goalsMap[Number(matchId)].home;
        match.awayGoals = goalsMap[Number(matchId)].away;

        await match.save();
        console.log("Saved match", { id: match.id, matchId: match.matchId });
      } else {
        console.error(`Match with matchId ${matchId} not found.`);
        continue;
      }
      
      await updateGuesses(guessIdentifiers, { homeGoals: match?.homeGoals, awayGoals: match?.awayGoals });

    } catch (error) {
      console.error(`Failed to update results for match ID ${matchId}`, error);
    }
  }
};

const getMatchesUpdatedData = async (matches: Match[]) => {  
  try {
    const matchIdsString = matches.map(match => match.matchId).join('-');

    // Fetch updated data once relevant matches have finished
    // const response = await axios.get(`${process.env.API_FOOTBALL_URL}/fixtures`, {
    //   params: {
    //     ids: matchIdsString,
    //   },
    //   headers: {
    //     'x-apisports-key': process.env.FOOTBALL_API_KEY,
    //   },
    // });

    // const response = {
    //   "data": {
    //     "response": [
    //       {
    //         "fixture": {
    //           "id": 111111,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T14:00:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 1,
    //             "name": "Liverpool",
    //             "logo": "https://media.api-sports.io/football/teams/1.png",
    //             "winner": true
    //           },
    //           "away": {
    //             "id": 2,
    //             "name": "Manchester United",
    //             "logo": "https://media.api-sports.io/football/teams/2.png",
    //             "winner": false
    //           }
    //         },
    //         "goals": {
    //           "home": 1,
    //           "away": 1
    //         },
    //       },
    //       {
    //         "fixture": {
    //           "id": 222222,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T14:00:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 3,
    //             "name": "Chelsea",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "Arsenal",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         },
    //         "goals": {
    //           "home": 0,
    //           "away": 1
    //         },
    //       },
    //       {
    //         "fixture": {
    //           "id": 333333,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T14:00:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 4,
    //             "name": "Aston Villa",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "Wolves",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         },
    //         "goals": {
    //           "home": 2,
    //           "away": 1
    //         },
    //       },
    //       {
    //         "fixture": {
    //           "id": 444444,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T14:00:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 3,
    //             "name": "Bournemouth",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "West Ham United",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         },
    //         "goals": {
    //           "home": 3,
    //           "away": 1
    //         },
    //       },
    //       {
    //         "fixture": {
    //           "id": 555555,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T14:00:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 3,
    //             "name": "Brighton",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "Tottenham Hotspurs",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         },
    //         "goals": {
    //           "home": 0,
    //           "away": 0
    //         },
    //       },
    //       {
    //         "fixture": {
    //           "id": 666666,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T14:00:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 3,
    //             "name": "Crystal Palace",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "Southampton",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         },
    //         "goals": {
    //           "home": 2,
    //           "away": 0
    //         },
    //       },
    //       {
    //         "fixture": {
    //           "id": 777777,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T14:00:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 3,
    //             "name": "Everton",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "Nottingham Forest",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         },
    //         "goals": {
    //           "home": 0,
    //           "away": 1
    //         },
    //       },
    //       {
    //         "fixture": {
    //           "id": 888888,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-07T18:30:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 3,
    //             "name": "Fulham",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "Newcastle United",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         },
    //         "goals": {
    //           "home": 0,
    //           "away": 2
    //         },
    //       },
    //       {
    //         "fixture": {
    //           "id": 999999,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T19:30:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 3,
    //             "name": "Ipswich",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "Manchester City",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         },
    //         "goals": {
    //           "home": 4,
    //           "away": 0
    //         },
    //       },
    //       {
    //         "fixture": {
    //           "id": 101101,
    //           "referee": null,
    //           "timezone": "UTC",
    //           "date": "2025-02-06T17:00:00+00:00",
    //           "timestamp": 1580997600,
    //           "periods": {},
    //           "venue": {},
    //           "status": {}
    //         },
    //         "teams": {
    //           "home": {
    //             "id": 3,
    //             "name": "Leicester City",
    //             "logo": "https://media.api-sports.io/football/teams/3.png",
    //             "winner": false
    //           },
    //           "away": {
    //             "id": 4,
    //             "name": "Brentford",
    //             "logo": "https://media.api-sports.io/football/teams/4.png",
    //             "winner": true
    //           }
    //         },
    //         "goals": {
    //           "home": 0,
    //           "away": 1
    //         },
    //       },
    //     ]
    //   }
    // };

    const response = {
      "data": {
        "response": [
          {
            "fixture": {
              "id": 111111,
              "referee": null,
              "timezone": "UTC",
              "date": "...",
              "timestamp": 1580997600,
              "periods": {},
              "venue": {},
              "status": {}
            },
            "teams": {
              "home": {
                "id": 1,
                "name": "Liverpool",
                "logo": "https://media.api-sports.io/football/teams/1.png",
                "winner": true
              },
              "away": {
                "id": 2,
                "name": "Manchester United",
                "logo": "https://media.api-sports.io/football/teams/2.png",
                "winner": false
              }
            },
            "goals": {
              "home": 7,
              "away": 0
            },
          },
          
        ]
      }
    };
    

    const goalsMap = response.data.response.reduce(
      (map: { [matchId: number]: { home: number; away: number } }, item: any) => {
        const matchId = item.fixture.id;
        const goals = item.goals;
        map[matchId] = goals;

        return map;
      },
      {} as { [matchId: number]: { home: number; away: number } }
    );
    
    return goalsMap;
  } catch (error) {
    console.error(`Failed to get matches updated data from`, )
  }
}

// TODO: maybe need to move it somehwere else as it is not under the responsibility of Match
const updateGuesses = async (
  guessIdentifiers: {userId: number, gameweekId: number },
  actualResult: { homeGoals: number, awayGoals: number }
) => {
  try {
    const guess = await Guess.findOne({
      where: {
        userId: guessIdentifiers.userId,
        gameweekId: Number(guessIdentifiers.gameweekId),
      },
    });

    if (guess) {
      const guessResult = determineGuessResult(guess, actualResult);      

      if (guessResult.exact) {
        guess.exact = guessResult.exact
      } else if (guessResult.correctDirection) {
        guess.correctDirection = guessResult.correctDirection;
      }

      await guess.save();
    } else {
      console.error(`Guess with identifiers ${guessIdentifiers} not found.`);
    }
  } catch (error) {
    console.error(`Failed to update results for user's guess`, guessIdentifiers);
  }
}

const determineGuessResult = (guess: Guess, actualResult: { homeGoals: number, awayGoals: number }) => {
  let exact = false;
  let correctDirection = false;
  
  if (guess.homeGoals == actualResult.homeGoals && guess.awayGoals == actualResult.awayGoals) {
    exact = guess.homeGoals == actualResult.homeGoals && guess.awayGoals == actualResult.awayGoals;
  } else { 
    // Determine the outcome of the actual match and the guess
    const actualOutcome = actualResult.homeGoals > actualResult.awayGoals
        ? 'home'
        : actualResult.homeGoals < actualResult.awayGoals
        ? 'away'
        : 'draw';
    
    const guessOutcome = guess.homeGoals > guess.awayGoals
        ? 'home'
        : guess.homeGoals < guess.awayGoals
        ? 'away'
        : 'draw';

    // Correct direction if the outcomes match
    correctDirection = actualOutcome === guessOutcome;
  }

  return { exact, correctDirection };
}

export default router;
