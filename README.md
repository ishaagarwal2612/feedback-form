# Feedback Form React App

This project is a full-stack feedback form built with React, featuring Supabase authentication and protected routes. Users need to authenticate before submitting feedback, and admins can log in to view all responses.

## Features
- User authentication (signup/login) using Supabase
- Protected feedback form
- Admin access control
- Thank you message after submission
- Admin panel to view all feedback responses

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a Supabase project:
   - Go to [Supabase](https://supabase.com)
   - Create a new project
   - Go to Project Settings > API
   - Copy the Project URL and anon/public key

3. Create a `.env` file in the root directory and add your Supabase credentials:
```env
REACT_APP_SUPABASE_URL=your_project_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

4. Start the development server:
```bash
npm start
```

## Tech Stack
- React
- TypeScript
- Supabase (Authentication)
- Webpack
- CSS Modules

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