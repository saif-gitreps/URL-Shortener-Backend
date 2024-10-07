# API Server for a URL Shortener Application

A Node.js application where users can create ShortIds for long URLs without authentication. Authenticated users can keep track of their URLs, create custom ShortIds, delete them, and monitor URL analytics.

## Features

**API Endpoints**
- **URL:**
  - Create (Custom and Random), delete, and get analytics.
- **Auth:**
  - Sign up, log in, refresh access token, get CSRF token, get current user, log out, and update user details.

🔐 **Authentication and Security**
- Stateless JWT authentication with refresh and access tokens using secure HTTP-only cookies.
- CSRF protection with the **Double-submit cookie** pattern.
- Role-based authorization.

💻 **Tech Stack and Features**
- Password encryption before storing in the database, with decryption for verification.
- Using the MVC pattern and separating authentication for microservice-like separation of concerns.
- **Rate limiters** for authentication routes based on different roles.
- Route protection from unauthenticated requests.
- **CSRF protection** for all POST requests.
- User input, URL, and ShortId validation using **express-validator** and custom sanitization.
- Custom logger for monitoring requests in the development terminal.
- Schema built with **Mongoose**, along with **aggregation pipeline** queries.
- Users can monitor analytics for each click in detail for every ShortId.

🎁 **Additional Features**
- 🔄 Highly customizable and extendable, with more features planned for future updates.

## Prerequisites

Before setting up the server, ensure you have the following prerequisites:

- Node.js and npm installed on your system.
- MongoDB installed and running.
- An internet browser for testing API endpoints (e.g., Postman).

## Installation

To install the backend server, follow these steps:

1. Clone the repository:

```
git clone https://github.com/yourusername/video-streaming-backend.git .
```

2. Install dependencies:

```
npm install
```

4. Configuration
Create a .env file in the root directory of the project and add the following variables:

```
PORT = 8000 or 3000
MONGO_URI = mongodb://localhost:27017 or your URI
FRONTEND_URL= <congifure your sites>
ACCESS_TOKEN_SECRET= <add an access token, example: SUPERSECRET1234>
CSRF_TOKEN_SECRET=<Your any secret>
REFRESH_TOKEN_SECRET= <add a refresh token of your own>

```

## Usage
To start the server, run the following command:

```
npm start
```

## RESTful APIs
The backend server follows RESTful API principles, allowing the front-end to make proper calls to the server. The API Endpoint can be accessed in the routes folder.
