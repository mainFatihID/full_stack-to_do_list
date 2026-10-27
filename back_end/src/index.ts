import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db.js';
import todoRoutes from './routes/todo.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api', todoRoutes);

app.get('/', (req, res) => {
  res.send('Todo API is running...');
});

// Test Database Connection on Startup
pool.getConnection()
  .then((connection) => {
    console.log(' Successfully connected to Aiven MySQL Database!');
    connection.release(); // Release connection back to the pool
  })
  .catch((err) => {
    console.error('❌ Failed to connect to Aiven MySQL Database:', err.message);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});