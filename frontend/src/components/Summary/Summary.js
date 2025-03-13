import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2'; // Importing different chart types
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import NavBar from '../NavBar/NavBar';
import { BASE_URL } from '../../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importing Axios for API calls

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function Summary({ onLogout }) {
    const [lineChartData, setLineChartData] = useState(null);
    const [barChartData, setBarChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTeam, setSelectedTeam] = useState('all'); // State for selected team
    const [playersData, setPlayersData] = useState([]); // To store player data for filtering
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchChartData() {
            try {
                // Retrieve the token from localStorage
                const token = localStorage.getItem('token');

                // Check if token exists
                if (!token) {
                    throw new Error('No authorization token found');
                }

                // Fetch data for both charts using axios
                const [lineDataResponse, barDataResponse] = await Promise.all([
                    axios.get(`${BASE_URL}/api/line-chart-data`, {
                        headers: {
                            'Authorization': `Bearer ${token}`, // Sending the token in the header
                        },
                    }),
                    axios.get(`${BASE_URL}/api/bar-chart-data`, {
                        headers: {
                            'Authorization': `Bearer ${token}`, // Sending the token in the header
                        },
                    }),
                ]);

                // Parse the responses
                const lineData = lineDataResponse.data;
                const barData = barDataResponse.data;

                setPlayersData(lineData); // Save all players data to state

                // Process line chart data for single stat comparison for each player
                const playerNames = lineData.flatMap(team =>
                    team.teamStats.map(player => `${player.playerName} (${team.teamName})`)); // Add team name to player name

                // Example: We could plot goals, assists, or points for each player across multiple teams
                const lineChartProcessedData = {
                    labels: playerNames,  // Player names with team names on X-axis
                    datasets: [
                        {
                            label: 'Goals',
                            data: lineData.flatMap(team =>
                                team.teamStats.map(player => player.goals) // Extract goals for each player
                            ),
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            fill: false,
                            tension: 0.1,
                        },
                        {
                            label: 'Assists',
                            data: lineData.flatMap(team =>
                                team.teamStats.map(player => player.assists) // Extract assists for each player
                            ),
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            fill: false,
                            tension: 0.1,
                        },
                        {
                            label: 'Points',
                            data: lineData.flatMap(team =>
                                team.teamStats.map(player => player.points) // Extract points for each player
                            ),
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: false,
                            tension: 0.1,
                        }
                    ],
                };

                // Process bar chart data for team-based stats (e.g., total goals for each team)
                const barChartProcessedData = {
                    labels: barData.map(team => team.teamName),  // Team names on X-axis
                    datasets: [
                        {
                            label: 'Total Goals',
                            data: barData.map(team =>
                                team.teamStats.reduce((sum, player) => sum + player.goals, 0) // Sum goals per team
                            ),
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Total Assists',
                            data: barData.map(team =>
                                team.teamStats.reduce((sum, player) => sum + player.assists, 0) // Sum assists per team
                            ),
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Total Points',
                            data: barData.map(team =>
                                team.teamStats.reduce((sum, player) => sum + player.points, 0) // Sum points per team
                            ),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                };

                setLineChartData(lineChartProcessedData);
                setBarChartData(barChartProcessedData);
                setLoading(false);
            } catch (error) {
                if( error.response.data.message ===  "Invalid token"){
                    localStorage.clear();
                    navigate('/');
                    onLogout();
                    setLoading(false);
                    alert("Your account has been logged out");
                } else{
                    console.error('Error fetching chart data:', error);
                    setLoading(false);
                }
            }
        }

        fetchChartData();
    }, [navigate, onLogout]);

    const handleTeamChange = (event) => {
        setSelectedTeam(event.target.value); // Update selected team
    };

    const filteredData = selectedTeam === 'all'
        ? playersData
        : playersData.filter(team => team.teamName === selectedTeam); // Filter by team if not 'all'

    const filteredPlayerNames = filteredData.flatMap(team =>
        team.teamStats.map(player => `${player.playerName} (${team.teamName})`)); // Filtered player names

    const lineChartProcessedData = {
        labels: filteredPlayerNames,  // Filtered player names with team names on X-axis
        datasets: [
            {
                label: 'Goals',
                data: filteredData.flatMap(team =>
                    team.teamStats.map(player => player.goals) // Extract goals for each player
                ),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
                tension: 0.1,
            },
            {
                label: 'Assists',
                data: filteredData.flatMap(team =>
                    team.teamStats.map(player => player.assists) // Extract assists for each player
                ),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: false,
                tension: 0.1,
            },
            {
                label: 'Points',
                data: filteredData.flatMap(team =>
                    team.teamStats.map(player => player.points) // Extract points for each player
                ),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                tension: 0.1,
            }
        ],
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Player Stats Comparison (Goals, Assists, Points)',
            },
        },
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Team Stats Comparison (Total Goals, Assists, Points)',
            },
        },
    };

    if (loading) {
        return <div>Loading chart data...</div>;
    }

    if (!lineChartData || !barChartData) {
        return <div>No chart data available.</div>;
    }

    return (
        <div>
            <NavBar onLogout={onLogout} />
            <div className="summary-content">
                <h2>Summary Charts</h2>

                {/* Dropdown for team selection */}
                <div className="team-selection">
                    <label for="team-select" id="team-select-label">Select Team: </label>
                    <select id="team-select" onChange={handleTeamChange} value={selectedTeam} aria-labelledby="team-select-label" aria-describedby="team-select-description">
                        <option value="all">All Teams</option>
                        <option value="Charlotte">Charlotte</option>
                        <option value="Gardner Webb">Gardner Webb</option>
                    </select>
                </div>

                {/* Line Chart */}
                <div className="chart-container">
                    <h3 id="line-chart-title">Line Chart: Player Stats Comparison</h3>
                    <Line data={lineChartProcessedData} options={lineChartOptions} aria-labelledby="line-chart-title"/>
                    <p aria-describedby="line-chart-description" id="line-chart-description">
                        The Line Chart compares individual player statistics (Goals, Assists, and Points) across different teams, providing a detailed view of player performance. The X-axis of the chart represents players, with their names displayed along with their respective team names for clarity. The Y-axis shows the values for each stat—goals, assists, and points—allowing easy comparison between players. Each stat is represented by a different colored line (red for goals, blue for assists, and green for points), helping to track how each player performs in each category. This chart is particularly useful for analyzing the contribution of individual players over time and understanding how their performance stacks up against other players in the league.
                    </p>
                </div>

                {/* Bar Chart */}
                <div className="chart-container">
                    <h3 id="bar-chart-title">Bar Chart: Team Stats Comparison</h3>
                    <Bar data={barChartData} options={barChartOptions}  aria-labelledby="bar-chart-title" />
                    <p aria-describedby="bar-chart-description" >
                        The Bar Chart, on the other hand, offers a high-level comparison of team performance by aggregating statistics such as total goals, assists, and points for each team. The X-axis represents the teams, while the Y-axis shows the total accumulated statistics for each team. Each stat is displayed as a bar, with red bars representing total goals, blue bars representing total assists, and green bars representing total points. This chart provides a quick overview of how each team is performing collectively, highlighting which teams are excelling in areas such as scoring, playmaking, and overall offensive contribution. It’s valuable for comparing teams against each other and understanding which teams are leading in terms of total performance. Together, these charts offer both individual player insights and team-wide comparisons, allowing coaches, analysts, and fans to assess player and team performance comprehensively.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Summary;
