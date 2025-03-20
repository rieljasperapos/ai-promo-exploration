import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import promoRoutes from './routes/promo.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/promos', promoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
