# African Nations League - INF4001N

## Student Information
- Student Number: KMSILY001
- Name: ILYAAS KAMISH

## Project Links
- Deployed Frontend: https: //african-nations-league.vercel.app/
- Deployed Backend: [[Your Render URL]](https://african-nations-league.onrender.com)


## System Rationale
The African Nations League platform was developed to simulate an African football tournament in a realistic and interactive way. The system addresses the following needs:

1. Voluntary participation: Federations can register teams and manage their squads.
2. Team management: Representatives can define squads, assign captains, and automatically generate player ratings.
3. Tournament simulation: Administrators can simulate matches and generate results, including scores, goal scorers, and key match statistics.
4. Public accessibility: Visitors can view tournament brackets, match summaries, and top scorers without needing to log in.
5. Flexibility & scalability: New teams can join, tournaments can restart, and analytics provide insights on team performance.

The system provides a realistic football simulation while remaining easy to use for representatives, administrators, and visitors.

## System Components
The platform consists of the following components:

1. Frontend
   - Built with React, Vite, Tailwind CSS
   - Manages user interfaces for visitors, representatives, and administrators
   - Handles routing and communication with the backend via REST API

2. Backend
   - Built with Node.js and Express
   - Manages authentication, team registration, match simulation, and analytics
   - Handles tournament logic and stores all data in the database

3. Database
   - MongoDB Atlas (NoSQL)
   - Stores teams, players, user roles, match results, and tournament state

4. Deployment
   - Frontend deployed on Vercel
   - Backend deployed on Render
   - Fully connected to allow real-time simulation and data updates

## System Architecture
The architecture of the platform follows a client-server model:

Frontend (React/Vite/Tailwind) <--HTTP/REST--> Backend (Node.js/Express) <---> MongoDB Atlas (Database)

- Frontend: Handles the UI for all user roles
- Backend: Processes requests, manages tournament logic, and communicates with the database
- Database: Stores persistent data for teams, matches, and analytics

## How to Run Locally

### Backend
cd backend
npm install
npm run dev

### Frontend
cd frontend
npm install
npm run dev

## Features Implemented

- User authentication (Admin & Representative roles)
- Team registration with auto-generated players (23 per squad)
- Tournament bracket generation (8 teams)
- Match simulation with scores and goal scorers
- Public pages: tournament bracket, match summaries, top scorers
- Admin panel to manage tournament and restart if needed
- Representative dashboard for team management
- Team performance analytics

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express
- Database: MongoDB Atlas (NoSQL)
- Deployment: Vercel (Frontend), Render (Backend)

## Notes

- Credentials for admin and database users are provided in a separate document.
- The platform is designed to be scalable, allowing new teams to register and tournaments to restart seamlessly.
