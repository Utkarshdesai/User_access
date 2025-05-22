# User Access Management System

A secure and efficient system for managing user access to software applications, built with Node.js, Express, and TypeORM.

## Features

- User Authentication with JWT
- Role-based Access Control (Admin, Manager, Employee)
- Software Management
- Access Request System
- Request Approval Workflow

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: TypeORM with SQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing, HTTP-only cookies

## Prerequisites

- Node.js (v14 or higher)
- SQL Database
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Utkarshdesai/User_access.git
cd User_access
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Server Configuration
PORT=3000

# Database Configuration
DATABASE_URL=mysql://username:password@localhost:3306/user_access
DB_HOST=localhost
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key

# Client Configuration
CLIENT_URL=http://localhost:3000
```

Environment Variables Description:
- `PORT`: The port number on which the server will run (default: 3000)
- `DATABASE_URL`: Full database connection URL including credentials
- `DB_HOST`: Database host address (default: localhost)
- `DB_PORT`: Database port number (default: 3306 for MySQL)
- `JWT_SECRET`: Secret key for JWT token generation and verification
- `CLIENT_URL`: URL of the frontend application

4. Initialize the database:
```bash
npm run typeorm migration:run
```

5. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Software Management
- `POST /api/software` - Create new software (Admin only)
- `GET /api/software` - List all software

### Access Requests
- `POST /api/requests` - Submit access request (Employee)
- `GET /api/requests` - List all requests (Manager/Admin)
- `PUT /api/requests/:id` - Approve/reject request (Manager/Admin)

## Role-Based Access

### Admin
- Create and manage software
- Approve/reject access requests
- View all requests

### Manager
- Approve/reject access requests
- View all requests

### Employee
- Submit access requests
- View own requests

## Security Features

- JWT stored in HTTP-only cookies
- Password hashing with bcrypt
- Role-based middleware protection
- Input validation
- Error handling middleware

## Error Handling

The system includes comprehensive error handling for:
- Authentication failures
- Invalid requests
- Database errors
- Authorization failures

## Author

Utkarsh Desai 