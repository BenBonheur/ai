# Rwanda Parking App

A comprehensive parking management system for Rwanda with MongoDB integration.

## Project Structure

\`\`\`
rwanda-parking-app/
├── frontend/           # Next.js frontend application
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   └── lib/          # Frontend utilities
├── backend/           # Backend API and database
│   ├── api/          # API routes
│   ├── lib/          # Database connection
│   └── models/       # MongoDB models
└── database/         # Database scripts and documentation
\`\`\`

## Features

- **Multi-role Authentication**: Client, Admin, Employee, Owner roles
- **Real-time Parking Management**: Live availability tracking
- **Interactive Map**: Location-based parking search
- **Instant Booking**: Multiple payment methods support
- **QR Code System**: Easy check-in/check-out process
- **Role-specific Dashboards**: Tailored interfaces for each user type
- **MongoDB Integration**: Scalable NoSQL database

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT tokens, bcrypt
- **Database**: MongoDB with Mongoose ODM
- **QR Codes**: qrcode library
- **UI Components**: Radix UI, Lucide React

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd rwanda-parking-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`
   
   Update `.env.local` with your MongoDB connection string:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/rwanda-parking-app
   JWT_SECRET=your-super-secret-jwt-key-here
   NEXT_PUBLIC_API_URL=http://localhost:3000/backend/api
   \`\`\`

4. **Start MongoDB**
   \`\`\`bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud service
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/backend/api

### Database Setup

The application will automatically create the necessary collections when you start using it. MongoDB schemas are defined in the `backend/models/` directory.

#### Sample Data

You can create sample data by registering users and creating parking lots through the application interface.

## API Endpoints

### Authentication
- `POST /backend/api/auth/register` - Register new user
- `POST /backend/api/auth/login` - User login

### Parking Lots
- `GET /backend/api/parking-lots` - Get parking lots with filters
- `POST /backend/api/parking-lots` - Create new parking lot

### Bookings
- `GET /backend/api/bookings` - Get bookings with filters
- `POST /backend/api/bookings` - Create new booking

### Dashboard
- `GET /backend/api/dashboard/stats` - Get dashboard statistics

## User Roles

1. **Client**: Book parking spaces, view bookings, make payments
2. **Admin**: Manage all users, parking lots, and system settings
3. **Employee**: Check-in/check-out vehicles, manage assigned parking lots
4. **Owner**: Manage owned parking lots, view revenue, manage employees

## Development

### Project Structure

- `frontend/app/` - Next.js pages and layouts
- `frontend/components/` - Reusable React components
- `backend/api/` - API route handlers
- `backend/models/` - MongoDB/Mongoose models
- `backend/lib/` - Database connection and utilities

### Adding New Features

1. Create MongoDB models in `backend/models/`
2. Add API routes in `backend/api/`
3. Create frontend components in `frontend/components/`
4. Add pages in `frontend/app/`

## Deployment

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update `MONGODB_URI` in your environment variables

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
