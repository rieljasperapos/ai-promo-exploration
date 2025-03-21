import { Request, Response } from 'express';
import { fetchFilteredPromos } from '../services/promo.service';
import { generateAiInsight } from '../services/ai.service';

export const getFilteredPromos = async (req: Request, res: Response) => {
  try {
    const user = req.body;

    if (!user.location || !user.cardTypes || !user.preferences) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const promos = await fetchFilteredPromos(user);
    const aiRepsonse = await generateAiInsight(promos);

    res.status(200).json(aiRepsonse);
  } catch (error) {
    console.error('Error fetching promos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
