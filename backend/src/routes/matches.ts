import { Router } from 'express';
import axios from 'axios';
import { Match } from '../models/match';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// Helper function to get the latest active gameweek ID
const getLatestActiveGameweek = async (): Promise<number | null> => {
  // TODO: Change the logic below to instead get the current gw:
  // get("https://v3.football.api-sports.io/fixtures/rounds?league=39&season=2019&current=true");
  // This endpoint gets updated every day, so if all the current gw's matches are over 
  // we shall show the next one's matches.
  // This should be 1 call per day.

  // try {
  //   const response = await axios.get(`${process.env.API_FOOTBALL_URL}/fixtures/rounds`, {
  //     params: {
  //       league: process.env.LEAGUE_CODE,
  //       season: process.env.SEASON,
  //       current: 'true',
  //     },
  //     headers: {
  //       'x-apisports-key': process.env.FOOTBALL_API_KEY,
  //     },
  //   });

  //   // Assuming the API returns an array of gameweeks and the last one is the active one
  //   const gameweeks = response.data.response;
  //   const latestGameweek = gameweeks.pop(); // Get the latest active gameweek

  //   if (latestGameweek) {
  //     return parseInt(latestGameweek.match(/\d+/)[0]); // Extract the number from the gameweek string
  //   }

  //   return null;
  // } catch (error) {
  //   console.error('Failed to fetch the latest active gameweek:', error);
  //   return null;
  // }

  return 1;
};

router.get('/upcoming', authenticate, async (req, res) => {
  try {    
    const gameweekId = await getLatestActiveGameweek();

    if (!gameweekId) {
      return res.status(500).json({ error: 'Failed to retrieve the latest active gameweek' });
    }

    // Check if the matches for this gameweek are already cached
    const cachedMatches = await Match.findAll({ where: { gameweekId } });

    if (cachedMatches.length > 0) {
      return res.json(cachedMatches);
    }

    // // Fetch upcoming matches for the gameweek from the API
    // const response = await axios.get(`${process.env.API_FOOTBALL_URL}/fixtures`, {
    //   params: {
    //     league: process.env.LEAGUE_CODE,
    //     season: process.env.SEASON,
    //     round: `Regular Season - ${gameweekId}`,
    //   },
    //   headers: {
    //     'x-apisports-key': process.env.FOOTBALL_API_KEY,
    //   },
    // });

    const response = {
      "data": {
        "response": [
          {
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
            }
          },
          {
            "teams": {
              "home": {
                "id": 3,
                "name": "Chelsea",
                "logo": "https://media.api-sports.io/football/teams/3.png",
                "winner": false
              },
              "away": {
                "id": 4,
                "name": "Arsenal",
                "logo": "https://media.api-sports.io/football/teams/4.png",
                "winner": true
              }
            }
          },
          {
            "teams": {
              "home": {
                "id": 4,
                "name": "Aston Villa",
                "logo": "https://media.api-sports.io/football/teams/3.png",
                "winner": false
              },
              "away": {
                "id": 4,
                "name": "Wolves",
                "logo": "https://media.api-sports.io/football/teams/4.png",
                "winner": true
              }
            }
          },
          {
            "teams": {
              "home": {
                "id": 3,
                "name": "Bournemouth",
                "logo": "https://media.api-sports.io/football/teams/3.png",
                "winner": false
              },
              "away": {
                "id": 4,
                "name": "West Ham United",
                "logo": "https://media.api-sports.io/football/teams/4.png",
                "winner": true
              }
            }
          },
          {
            "teams": {
              "home": {
                "id": 3,
                "name": "Brighton",
                "logo": "https://media.api-sports.io/football/teams/3.png",
                "winner": false
              },
              "away": {
                "id": 4,
                "name": "Tottenham Hotspurs",
                "logo": "https://media.api-sports.io/football/teams/4.png",
                "winner": true
              }
            }
          },
          {
            "teams": {
              "home": {
                "id": 3,
                "name": "Crystal Palace",
                "logo": "https://media.api-sports.io/football/teams/3.png",
                "winner": false
              },
              "away": {
                "id": 4,
                "name": "Southampton",
                "logo": "https://media.api-sports.io/football/teams/4.png",
                "winner": true
              }
            }
          },
          {
            "teams": {
              "home": {
                "id": 3,
                "name": "Everton",
                "logo": "https://media.api-sports.io/football/teams/3.png",
                "winner": false
              },
              "away": {
                "id": 4,
                "name": "Nottingham Forest",
                "logo": "https://media.api-sports.io/football/teams/4.png",
                "winner": true
              }
            }
          },
          {
            "teams": {
              "home": {
                "id": 3,
                "name": "Fulham",
                "logo": "https://media.api-sports.io/football/teams/3.png",
                "winner": false
              },
              "away": {
                "id": 4,
                "name": "Newcastle United",
                "logo": "https://media.api-sports.io/football/teams/4.png",
                "winner": true
              }
            }
          },
          {
            "teams": {
              "home": {
                "id": 3,
                "name": "Ipswich",
                "logo": "https://media.api-sports.io/football/teams/3.png",
                "winner": false
              },
              "away": {
                "id": 4,
                "name": "Manchester City",
                "logo": "https://media.api-sports.io/football/teams/4.png",
                "winner": true
              }
            }
          },
          {
            "teams": {
              "home": {
                "id": 3,
                "name": "Leicester City",
                "logo": "https://media.api-sports.io/football/teams/3.png",
                "winner": false
              },
              "away": {
                "id": 4,
                "name": "Brentford",
                "logo": "https://media.api-sports.io/football/teams/4.png",
                "winner": true
              }
            }
          },
        ]
      }
    };
    

    const matchesData = response.data.response;
    console.log("HERE!");
    
    // Map the API data to your Match model
    const matches = matchesData.map((data: any) => ({
      gameweekId,
      homeTeam: data.teams.home.name,
      awayTeam: data.teams.away.name,
      homeGoals: 0,
      awayGoals: 0,
    }));

    console.log({matches});
    
    // Save the matches to the cache (database)
    const savedMatches = await Match.bulkCreate(matches);
    res.json(savedMatches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

export default router;
