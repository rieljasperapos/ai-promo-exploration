import express from 'express';
import { getFilteredPromos } from '../controllers/promo.controller';

const router = express.Router();

router.post('/filter', getFilteredPromos);

export default router;
