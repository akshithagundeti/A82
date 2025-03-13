import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import NavBar from '../NavBar/NavBar';
import axios from 'axios'; // Import axios
import { BASE_URL } from '../../App';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Reports({onLogout}) {
  const [unccPieData, setUnccPieData] = useState(null);
  const [gwPieData, setGwPieData] = useState(null);
  const [playersData, setPlayersData] = useState({
    unccPlayers: [],
    gwPlayers: [],
  });
  const [selectedTeam, setSelectedTeam] = useState('uncc');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authorization token found');
        }

        // Use axios instead of fetch
        const response = await axios.get(`${BASE_URL}/api/line-chart-data`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = response.data;

        const unccTeam = data.find(team => team.teamName === 'Charlotte');
        const gwTeam = data.find(team => team.teamName === 'Gardner Webb');

        if (unccTeam && gwTeam) {
          const processTeamData = (teamStats) => {
            return teamStats.map(player => ({
              playerName: player.playerName,
              goals: player.goals,
              assists: player.assists,
              points: player.points,
            }));
          };

          setPlayersData({
            unccPlayers: processTeamData(unccTeam.teamStats),
            gwPlayers: processTeamData(gwTeam.teamStats),
          });

          const generatePieData = (players) => {
            return {
              labels: players.map(player => player.playerName),
              datasets: [
                {
                  label: 'Goals Distribution',
                  data: players.map(player => player.goals),
                  backgroundColor: players.map((_, index) => `hsl(${(index * 360) / players.length}, 100%, 70%)`),
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  borderWidth: 1,
                },
              ],
            };
          };

          setUnccPieData(generatePieData(unccTeam.teamStats));
          setGwPieData(generatePieData(gwTeam.teamStats));

          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setLoading(false);
      }
    }

    fetchChartData();
  }, []);

  // Handle team change
  const handleTeamChange = (e) => {
    setSelectedTeam(e.target.value);
    setSelectedPlayer(null); // Reset player selection
  };

  // Handle player change
  const handlePlayerChange = (e) => {
    const playerName = e.target.value;
    const players = selectedTeam === 'uncc' ? playersData.unccPlayers : playersData.gwPlayers;
    const selected = players.find(player => player.playerName === playerName);
    setSelectedPlayer(selected);
  };

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  if (!unccPieData || !gwPieData) {
    return <div>No chart data available.</div>;
  }

  const pieChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Goals Distribution by Player',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} goals`;
          },
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Player Stats Comparison (Bar Chart)',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const barChartData = {
    labels: ['Goals', 'Assists', 'Points'],
    datasets: selectedPlayer ? [{
      label: selectedPlayer.playerName,
      data: [selectedPlayer.goals, selectedPlayer.assists, selectedPlayer.points],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    }] : [],
  };

  return (
    <div>
      <NavBar onLogout={onLogout} />
      <div className="reports-content">
        <h2>Reports Charts</h2>

        <div>
          {/* Pie Charts Side by Side */}
          <div className="charts-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* UNCC Pie Chart */}
            <div className="chart-container" style={{ width: '48%' }}>
              <h3>UNCC Team Goals Distribution</h3>
              <Pie
                data={unccPieData}
                options={pieChartOptions}
                aria-labelledby="uncc-pie-chart-title"
              />
              <p>
                This pie chart shows the distribution of goals scored by each player in the UNCC team.
                The size of each slice represents the proportion of goals scored by the player.
                <br />
              </p>
            </div>

            {/* Gardner Webb Pie Chart */}
            <div className="chart-container" style={{ width: '48%' }}>
              <h3>Gardner Webb Team Goals Distribution</h3>
              <Pie
                aria-labelledby="gw-pie-chart-title"
                data={gwPieData}
                options={pieChartOptions}
              />
              <p>
                This pie chart shows the distribution of goals scored by each player in the Gardner Webb team.
                The size of each slice represents the proportion of goals scored by the player.
                <br />
              </p>
            </div>
          </div>
          <p>
          The Pie Charts display the goals distribution for players in two teams, UNCC and Gardner Webb. The chart for each team shows the proportion of goals scored by each player, with each slice representing a different player. The size of the slice is proportional to the number of goals scored by that player. This allows for a quick visual comparison of how each player contributes to the team's overall goal count. The color of each slice is uniquely generated for every player, ensuring that it is easy to distinguish between them. The chart is interactive with tooltips that display the exact number of goals scored by each player when hovering over a slice.
          </p>
        </div>

        {/* Bar Chart */}
        <div className="chart-container" style={{ marginTop: '40px' }}>
          <h3>Player Stats Bar Chart</h3>
          <select onChange={handleTeamChange} value={selectedTeam}>
            <option value="uncc">UNCC</option>
            <option value="gw">Gardner Webb</option>
          </select>

          <select
            onChange={handlePlayerChange}
            value={selectedPlayer ? selectedPlayer.playerName : ''}
            disabled={!selectedTeam}
          >
            <option value="">Select Player</option>
            {(selectedTeam === 'uncc' ? playersData.unccPlayers : playersData.gwPlayers).map(player => (
              <option key={player.playerName} value={player.playerName}>{player.playerName}</option>
            ))}
          </select>
          {
            selectedPlayer && selectedPlayer.playerName !== '' ? 
            <div>
              <Bar data={barChartData} options={barChartOptions} />
              <p>
              The Bar Chart, on the other hand, allows for a detailed comparison of a selected player's stats (goals, assists, and points). After selecting a team (UNCC or Gardner Webb) and a player, the bar chart displays three bars representing the player's performance in goals, assists, and points. Each bar's height corresponds to the value of the respective stat. This chart is useful for analyzing individual player performance in a clear, concise manner. The bar chart updates dynamically when a player is selected from the dropdown menu, giving a focused comparison of their statistics. The tooltips show the exact values for goals, assists, and points, offering precise insights into player contributions.
              </p>
            </div>
          :
          <div> Please Select a Player to see the statistics </div>
          }
          
        </div>
      </div>
    </div>
  );
}

export default Reports;
