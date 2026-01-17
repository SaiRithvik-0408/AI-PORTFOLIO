# Portfolio Backend API

Backend API for the AI Portfolio website built with Node.js, Express, and MongoDB.

## Features

- 🔐 **JWT Authentication** - Secure admin authentication
- 📧 **Contact Management** - Store and manage contact form submissions
- 💬 **Feedback System** - Collect and view user feedback
- 🎨 **Config Management** - Dynamic portfolio configuration including colors
- 🗄️ **MongoDB Database** - Cloud-based data storage with MongoDB Atlas

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB installation)
- npm or yarn

## Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

   Update the following in `.env`:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_password
   FRONTEND_URL=http://localhost:5173
   ```

3. **Seed the database:**
   ```bash
   npm run seed
   ```
   This creates the initial admin user and default configuration.

## Running the Server

### Development
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify JWT token

### Contacts (Public)
- `POST /api/contacts` - Submit contact form

### Contacts (Admin Only)
- `GET /api/contacts` - Get all contacts
- `DELETE /api/contacts/:id` - Delete a contact
- `PATCH /api/contacts/:id/read` - Mark contact as read

### Feedback (Public)
- `POST /api/feedback` - Submit feedback

### Feedback (Admin Only)
- `GET /api/feedback` - Get all feedback
- `DELETE /api/feedback/:id` - Delete feedback
- `PATCH /api/feedback/:id/read` - Mark feedback as read

### Configuration (Public)
- `GET /api/config` - Get portfolio configuration
- `GET /api/config/colors` - Get color configuration

### Configuration (Admin Only)
- `PUT /api/config` - Update portfolio configuration
- `PUT /api/config/colors` - Update colors
- `POST /api/config/colors/reset` - Reset colors to default

### Health Check
- `GET /api/health` - Server health check

## Database Schema

### Admin
```javascript
{
  username: String,
  passwordHash: String,
  createdAt: Date
}
```

### Contact
```javascript
{
  name: String,
  email: String,
  message: String,
  isRead: Boolean,
  createdAt: Date
}
```

### Feedback
```javascript
{
  name: String,
  email: String,
  feedback: String,
  rating: Number (1-5),
  isRead: Boolean,
  createdAt: Date
}
```

### Config
```javascript
{
  configKey: String (enum: 'portfolio', 'colors', 'sections'),
  configData: Mixed,
  updatedAt: Date
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Admin routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are valid for 24 hours.

## Default Admin Credentials

After running the seed script:
- **Username:** admin
- **Password:** admin123

**⚠️ IMPORTANT:** Change these credentials in production!

## MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Go to **Database Access** and create a database user
4. Go to **Network Access** and add your IP address (or 0.0.0.0/0 for development)
5. Click **Connect** → **Connect your application**
6. Copy the connection string and add it to your `.env` file

## Error Handling

The API returns consistent error responses:

```javascript
{
  success: false,
  message: "Error description"
}
```

## CORS Configuration

The server is configured to accept requests from the frontend URL specified in the `.env` file. Update `FRONTEND_URL` for production deployment.

## Security Best Practices

1. **Change default admin credentials** immediately
2. **Use strong JWT_SECRET** (at least 32 characters)
3. **Enable HTTPS** in production
4. **Restrict MongoDB network access** to specific IPs
5. **Keep dependencies updated** regularly

## Deployment

### Heroku
```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Vercel/Railway
1. Connect your GitHub repository
2. Add environment variables in the dashboard
3. Deploy

## Troubleshooting

### MongoDB Connection Issues
- Verify your connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure the database user has proper permissions

### Authentication Errors
- Verify JWT_SECRET is set in `.env`
- Check if the token has expired (24-hour validity)
- Ensure the admin user exists in the database

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
