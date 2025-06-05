# MongoDB Setup for Rwanda Parking App

## Local MongoDB Installation

### Windows
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Start MongoDB service:
   \`\`\`cmd
   net start MongoDB
   \`\`\`

### macOS
\`\`\`bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
\`\`\`

### Linux (Ubuntu)
\`\`\`bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
\`\`\`

## MongoDB Atlas (Cloud) Setup

1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster
4. Configure network access (add your IP)
5. Create a database user
6. Get connection string

## Database Collections

The application will automatically create these collections:

### users
- Stores user information and authentication data
- Indexes: email (unique), role

### parkinglots
- Stores parking lot information
- Indexes: location (text), ownerId, coordinates (2dsphere)

### bookings
- Stores booking information
- Indexes: userId, parkingLotId, status, createdAt

## Sample MongoDB Commands

### Connect to MongoDB
\`\`\`bash
mongosh "mongodb://localhost:27017/rwanda-parking-app"
\`\`\`

### Create Sample Data
\`\`\`javascript
// Create a sample user
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  phone: "+250788123456",
  password: "$2a$12$hashedpassword",
  role: "client",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})

// Create a sample parking lot
db.parkinglots.insertOne({
  name: "Kigali City Center Parking",
  description: "Secure parking in the heart of Kigali",
  location: "Kigali City Center",
  address: "KN 4 Ave, Kigali",
  latitude: -1.9441,
  longitude: 30.0619,
  totalSlots: 100,
  availableSlots: 85,
  pricePerHour: 500,
  pricePerDay: 5000,
  operatingHours: {
    open: "06:00",
    close: "22:00"
  },
  amenities: ["Security", "CCTV", "Covered"],
  features: ["24/7 Access", "Electric Vehicle Charging"],
  images: [],
  rating: 4.5,
  totalReviews: 120,
  isActive: true,
  isApproved: true,
  ownerId: ObjectId("user_id_here"),
  createdAt: new Date(),
  updatedAt: new Date()
})
\`\`\`

### Useful Queries
\`\`\`javascript
// Find all active parking lots
db.parkinglots.find({ isActive: true, isApproved: true })

// Find bookings for a specific user
db.bookings.find({ userId: ObjectId("user_id") }).sort({ createdAt: -1 })

// Get parking lots with available slots
db.parkinglots.find({ availableSlots: { $gt: 0 } })

// Get revenue statistics
db.bookings.aggregate([
  { $match: { paymentStatus: "paid" } },
  { $group: { _id: null, totalRevenue: { $sum: "$totalCost" } } }
])
\`\`\`

## Environment Variables

Make sure to set these in your `.env.local`:

\`\`\`env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/rwanda-parking-app

# For MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rwanda-parking-app?retryWrites=true&w=majority
\`\`\`

## Backup and Restore

### Backup
\`\`\`bash
mongodump --uri="mongodb://localhost:27017/rwanda-parking-app" --out=./backup
\`\`\`

### Restore
\`\`\`bash
mongorestore --uri="mongodb://localhost:27017/rwanda-parking-app" ./backup/rwanda-parking-app
