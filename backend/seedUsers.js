import mongoose from 'mongoose';
import User from './models/userModel.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const dummyUsers = [
  {
    name: 'Admin User',
    email: 'admin1@example.com',
    password: 'Admin123', // Will be hashed
    isAdmin: true,
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'User1234', // Will be hashed
    isAdmin: false,
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'User1234',
    isAdmin: false,
    role: 'user'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected');

    // Hash passwords before saving
    for (const user of dummyUsers) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }

    await User.deleteMany({});
    await User.insertMany(dummyUsers);
    console.log('Database seeded successfully!');
    
    // Display the created users with their plaintext passwords for reference
    console.log('\nCreated users:');
    dummyUsers.forEach(user => {
      console.log(`Email: ${user.email} | Password: ${user.password.replace(/./g, '*')}`);
    });
    console.log('\nActual passwords (for testing only):');
    console.log('Admin: Admin123');
    console.log('Regular Users: User1234');
    
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();