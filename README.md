# Feedback Form React App

This project is a full-stack feedback form built with React (frontend) and Node.js/Express (backend). Users can submit feedback, and admins can log in to view all responses.

## Features
- User feedback form (name, email, message)
- Thank you message after submission
- Admin login to view all feedback responses
- Data stored in a JSON file on the server

## Prerequisites
- Node.js and npm installed
- [Surge](https://surge.sh/) account and CLI installed globally (`npm install -g surge`)

## Getting Started

### 1. Install dependencies
```
npm install
```

### 2. Start the backend server
This will store feedback in `feedbacks.json` and serve API endpoints.
```
npm run start-server
```
The backend runs on [http://localhost:4000](http://localhost:4000).

### 3. Build the React frontend
```
npm run build
```
This will create a `dist/` folder with the production build.

### 4. Deploy the frontend to Surge
1. Make sure you have the Surge CLI installed:
   ```
npm install -g surge
   ```
2. Deploy the `dist/` folder:
   ```
surge ./dist
   ```
3. Follow the prompts to set your Surge domain (or use the suggested one).

### 5. (Optional) Change the API URL for production
By default, the frontend expects the backend at `http://localhost:4000`. If you deploy your backend elsewhere, update the `API_URL` in `Components/FeedbackForm.jsx` and `Components/AdminLogin.jsx` to point to your production backend.

## Admin Credentials
- **Username:** admin
- **Password:** admin123

## Notes
- The backend must be running and accessible to the deployed frontend for feedback submission and admin login to work.
- For production, consider deploying the backend to a service like Heroku, Render, or your own server.

## License
MIT 