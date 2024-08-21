import React, { useEffect, useState } from 'react';
import axios from 'axios';

// TODO: make this configurable and available for both frontend and backend parts
const SEMI_FINAL_GWS = ['8', '14', '21', '27'];
const FINAL_GWS = ['30', '35', '38'];


interface CupMatch {
  username: string;
  gameweekPoints: number[];
  totalPoints: number;
}

const Cup: React.FC = () => {
  const [semiFinals, setSemiFinals] = useState<CupMatch[]>([]);
  const [finals, setFinals] = useState<CupMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCupData = async () => {
      try {
        const response = await axios.get('/api/cup');
        setSemiFinals(response.data.semiFinals);
        setFinals(response.data.finals);
      } catch (error) {
        console.error('Error fetching cup data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCupData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Cup Semi-Finals</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            {SEMI_FINAL_GWS.map((gw) => (
              <th>GW {gw}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {semiFinals.map((match, index) => (
            <tr key={index}>
              <td>{match.username}</td>
              {match.gameweekPoints.map((points, i) => (
                <td key={i}>{points}</td>
              ))}
              <td>{match.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Cup Finals</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            {FINAL_GWS.map((gw) => (
              <th>GW {gw}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {finals.map((match, index) => (
            <tr key={index}>
              <td>{match.username}</td>
              {match.gameweekPoints.map((points, i) => (
                <td key={i}>{points}</td>
              ))}
              <td>{match.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cup;
