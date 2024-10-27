# Talk-A-Tive

Talk-A-Tive is a real-time chat application built with React JS and Socket.io for seamless communication. The app ensures user data is stored securely with encrypted storage in MongoDB, and it offers features like group chat creation, notifications, and real-time typing indicators.

## Technologies Used

- **Client:** React JS
- **Server:** Node JS, Express JS
- **Database:** MongoDB

## Demo

[Click here to visit the live website](https://talk-a-tive-rpxh.onrender.com/)


## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   ```bash
   cd chatapp

   Or download the repository as a ZIP file and extract it.
2. Set Up Environment Variables:
   Create a .env file in the root directory and add the following variables with your own values:
   ```bash
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-secret-key>
   NODE_ENV=development

### Running the Project
1. Backend Setup
   Open a terminal, navigate to the chatapp directory, and run the following commands to set up and start the backend server:
   ```bash
   npm install
   ```bash
   npm start

2. Frontend Setup
   Open a new terminal window, navigate to the frontend directory, and run the following commands to set up and start the frontend:
   ```bash
   cd frontend
   ```bash
   npm install
   ```bash
   npm start

### Additional Notes
1. Backend runs on the port specified in the .env file (PORT=5000 by default).
2. Frontend will be accessible on a separate port. Make sure both the backend and frontend are running in separate terminals.


<!-- ### Dependencies
1. Backend: Node.js, Express, Mongoose
2. Frontend: React, Axios  -->






<!-- ## Features

- **User Authentication:** Secure login and signup functionality for users.
  
  ![Authentication Screenshot](<your-authentication-screenshot-link>)

- **Real-Time Messaging:** One-to-one chat with real-time typing indicators to enhance the chat experience.
  
  ![Real-Time Messaging Screenshot](<your-real-time-chat-screenshot-link>)

- **Group Chats:** Create group chats, add or remove users, and chat within groups.
  
  ![Group Chats Screenshot](<your-group-chats-screenshot-link>)

- **User Search:** Quickly find other users within the app.
  
  ![User Search Screenshot](<your-user-search-screenshot-link>)

- **Notifications:** Stay updated with notifications for new messages and group activities.
  
  ![Notifications Screenshot](<your-notifications-screenshot-link>)

- **Profile Viewing:** View other users' profiles within the app.
  
  ![Profile Viewing Screenshot](<your-profile-view-screenshot-link>) -->
