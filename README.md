# Susi Network

A modern web application for secure digital connectivity with Telegram authentication.

## Features

- Telegram Login Widget integration for authentication
- Modern, responsive UI using Chakra UI
- Secure and private connection management
- User-friendly dashboard

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A Telegram bot (created via [@BotFather](https://t.me/botfather))

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure your Telegram bot:
   - Create a bot using [@BotFather](https://t.me/botfather) if you haven't already
   - Get your bot's username and token
   - Set up your domain in BotFather using the `/setdomain` command

4. Update the Login component:
   - Open `src/pages/Login.tsx`
   - Replace `'YOUR_BOT_USERNAME'` with your actual bot username
   - Replace `'YOUR_BOT_TOKEN'` with your actual bot token (in a production app, this should be stored securely on the server)

## Development

To run the application in development mode:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Building for Production

To create a production build:

```bash
npm run build
```

## Telegram Login Widget

This application uses the Telegram Login Widget for authentication. The widget provides a secure way to authenticate users using their Telegram accounts.

When a user successfully authenticates, the application receives the following data:
- id: Unique identifier for the user
- first_name: User's first name
- last_name: User's last name (optional)
- username: User's Telegram username (optional)
- photo_url: URL to the user's profile photo (optional)
- auth_date: Unix timestamp when the authentication was received
- hash: HMAC-SHA256 signature of the data

### Security Note

In a production environment, you should verify the authentication data on the server side. The current implementation includes a simplified client-side check that doesn't actually verify the hash. For proper security:

1. Send the authentication data to your server
2. Verify the hash on the server using your bot token
3. Only then allow access to protected resources

## Technologies Used

- React
- TypeScript
- Chakra UI
- React Router
- Telegram Login Widget
