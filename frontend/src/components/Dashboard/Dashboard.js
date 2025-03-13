import React, { useEffect } from 'react';
import NavBar from '../NavBar/NavBar';
import './Dashboard.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const Dashboard = ({ onLogout }) => {

  // Show toast notification when component is mounted for the first time
  useEffect(() => {
    // Convert the value from localStorage to boolean
    const toastShown = localStorage.getItem('toastShown') !== 'not-shown';

    if (!toastShown) {
      // Show the toast
      toast.success('Successfully logged in');
      setTimeout(()=>{
        localStorage.setItem('toastShown', 'shown');
      }, 1000);
    }
  }, []);

  return (
    <div role="main">
      <NavBar onLogout={onLogout} role="navigation" aria-label="Main Navigation" />
      <ToastContainer />
      <div className='dashboard-container'>
        <h1 tabIndex="0">Charlotte Women's Lacrosse Begins Program with Historic Output</h1>
        <div className="summary">
          <p>
            Charlotte Women's Lacrosse made a monumental debut in the American Athletic Conference by securing a dominant 20-2 victory over Gardner-Webb at Jerry Richardson Stadium. This stunning performance not only marked a significant milestone for the team but also set a new record for the most goals scored in a program's debut. The victory was an emotional achievement for Coach Clare Short, who had built the program from the ground up. The game saw impressive individual performances, with attackers Kylie Gioia and Claire Schotta leading the charge, each scoring four goals. The team's defense also shone, with Abby Warner in goal allowing just one goal, and Gianna Cutaia contributing three forced turnovers. This historic win represents a fresh chapter for Charlotte Women's Lacrosse, as the team displayed both offensive power and defensive stability. The victory serves as a symbol of the program’s potential, laying the foundation for future success in the American Athletic Conference. This debut not only excited fans but also raised expectations for what is to come, making it an unforgettable moment in the team's history.
          </p>
          <p>
            <strong>Source: </strong>
            <a href="https://charlotte49ers.com/news/2025/2/8/womens-lacrosse-charlotte-womens-lacrosse-begins-program-with-historic-output.aspx" target="_blank" rel="noopener noreferrer">
              Charlotte 49ers - Women's Lacrosse Begins Program with Historic Output
            </a>
          </p>
        </div>
        <div className="technical-aspects">
          <h2 tabIndex="0">Technical Aspects of the Project</h2>
          <p>
            The project utilizes a full-stack web development approach. The frontend is built with React.js, which provides a dynamic and responsive user interface. The backend is powered by Node.js and Express, serving as the server and API layer. MongoDB, hosted on DigitalOcean, is used for storing data, including team statistics and player information. For data extraction, we leverage the csvtojson library to process CSV files and transform them into structured data for MongoDB. Additionally, we ensure smooth connectivity with the database using Mongoose, which provides an elegant MongoDB object modeling solution. The deployment is facilitated by a cloud service, enabling seamless scaling and access. The goal of this project is to provide an interactive and efficient dashboard to showcase team performance and historical game data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
