import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js'; // Import auth routes

dotenv.config();

const app = express();

// --- FIXED CORS ---
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],   // ← add this
  exposedHeaders: [
    'X-Total-Count',
    'X-Page',
    'X-Page-Size',
    'X-Total-Pages'
  ],
}));

app.use(express.json());
app.use(cookieParser());

connectDB();

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes); // Mount auth routes under /api/auth
// Add this error handler AFTER all routes

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' }); // Return JSON instead of HTML
});
const PORT = process.env.PORT || 9009;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
