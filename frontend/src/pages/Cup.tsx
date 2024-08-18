import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface CupMatch {
  username: string;
  gameweekPoints: number[];
  totalPoints: number;
}

interface CupState {
  semiFinals: {
    match1: CupMatch[];
    match2: CupMatch[];
  };
  final: CupMatch[];
}

const Cup = () => {
  const [cupState, setCupState] = useState<CupState | null>(null);

  useEffect(() => {
    const fetchCupState = async () => {
      try {
        const response = await axios.get('/api/cup/state');
        setCupState(response.data);
      } catch (error) {
        console.error('Failed to fetch cup state', error);
      }
    };

    fetchCupState();
  }, []);

  if (!cupState) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Cup</h2>

      <h3>Semi-Finals</h3>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            {cupState.semiFinals.match1[0]?.gameweekPoints.map((_, index) => (
              <th key={index}>GW {index + 1}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cupState.semiFinals.match1.map((player, index) => (
            <tr key={index}>
              <td>{player.username}</td>
              {player.gameweekPoints.map((points, i) => (
                <td key={i}>{points}</td>
              ))}
              <td>{player.totalPoints}</td>
            </tr>
          ))}
          {cupState.semiFinals.match2.map((player, index) => (
            <tr key={index}>
              <td>{player.username}</td>
              {player.gameweekPoints.map((points, i) => (
                <td key={i}>{points}</td>
              ))}
              <td>{player.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {cupState.final.length > 0 && (
        <>
          <h3>Final</h3>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                {cupState.final[0]?.gameweekPoints.map((_, index) => (
                  <th key={index}>GW {index + 1}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cupState.final.map((player, index) => (
                <tr key={index}>
                  <td>{player.username}</td>
                  {player.gameweekPoints.map((points, i) => (
                    <td key={i}>{points}</td>
                  ))}
                  <td>{player.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Cup;
