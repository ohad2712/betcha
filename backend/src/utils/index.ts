// Helper function to get the latest active gameweek ID
export const getLatestActiveGameweekId = async (): Promise<number | null> => {
  // TODO: Change the logic below to instead get the current gw:
  // get("https://v3.football.api-sports.io/fixtures/rounds?league=39&season=2019&current=true");
  // This endpoint gets updated every day, so if all the current gw's matches are over 
  // we shall show the next one's matches.
  // This should be 1 call per day. The data should be saved in a cache with the day it got lastly called, so we know whether to call it now or use the cached data.

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
  //     // TODO: add before this return a query for the Gameweeks table to get the gameweek for current year with weekNumber that's equal to parseInt(latestGameweek.match(/\d+/)[0]) to return the id and not just the number.
  //     return parseInt(latestGameweek.match(/\d+/)[0]); // Extract the number from the gameweek string
  //   }

  //   return null;
  // } catch (error) {
  //   console.error('Failed to fetch the latest active gameweek:', error);
  //   return null;
  // }

  return 1;
};