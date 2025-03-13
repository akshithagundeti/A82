const mongoose = require('mongoose');
const csvtojson = require('csvtojson');
require('dotenv').config();
const path = require('path');

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI,{ 
    serverSelectionTimeoutMS: 30000, // Wait up to 30 seconds for MongoDB connection
    socketTimeoutMS: 45000, // Optional: Increase socket timeout
  })
  .then(() => console.log('Connected to MongoDB on DigitalOcean'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Import the models
const Team = require('./models/Team');

// CSV file paths (adjust as needed)
const gardnerWebbCsvPath = path.join(__dirname, 'gardner_web_team.csv');
const unccCsvPath = path.join(__dirname, 'uncc_web_team.csv');

// Function to process CSV data
const processCSV = async (csvPath, teamName, score, location) => {
  try {
    // Parse the CSV file into JSON
    const playersData = await csvtojson().fromFile(csvPath);

    // Transform CSV data into player objects
    const teamStats = playersData
      .filter(player => player.Player && player.Player !== 'TEAM') // Remove team row
      .map(player => ({
        position: player.Pos,
        playerName: player.Player,
        goals: parseInt(player.G) || 0,
        assists: parseInt(player.A) || 0,
        points: parseInt(player.P) || 0,
        shots: parseInt(player.SH) || 0,
        shotsOnGoal: parseInt(player.SOG) || 0,
        groundBalls: parseInt(player.GB) || 0,
        turnovers: parseInt(player.TO) || 0,
        causedTurnovers: parseInt(player.CT) || 0,
        drawControls: parseInt(player.DC) || 0,
        fouls: parseInt(player.FOULS) || 0,
        freePositionShots: player.FPS || "0-0", // Handle freePositionShots as string
      }));

    // Create the team document
    const teamData = new Team({
        teamName: teamName,
        teamStats: teamStats,
    });

    // console.log( teamData  )
    // Save the team document to MongoDB
    await teamData.save();
    console.log(`Successfully saved team data for ${teamName}`);
  } catch (error) {
    console.error('Error processing CSV data:', error);
  }
};

// Load data for both games
const loadData = async () => {
  await processCSV(gardnerWebbCsvPath, 'Gardner Webb');  // Gardner-Webb game
  await processCSV(unccCsvPath, 'Charlotte');  // UNCC game
};

// Call the loadData function to load the data
loadData().then(() => {
  mongoose.connection.close();
});
