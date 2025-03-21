import { OpenAI } from 'openai';
import { FilteredPromo } from '../types/promotion-types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const aiInsightCache = new Map<string, string>();

export const generateAiInsight = async (
  promos: FilteredPromo[] | { message: string },
) => {
  try {
    if (!Array.isArray(promos)) {
      return promos;
    }

    if (promos.length === 0) {
      return {
        ai: 'No available promotions at the moment.',
        promos: [],
      };
    }

    const cacheKey = JSON.stringify(promos);

    if (aiInsightCache.has(cacheKey)) {
      return JSON.parse(aiInsightCache.get(cacheKey)!);
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI that provides insights about promotional discounts. Make sure to give concise and engaging notes. Make it a one liner',
        },
        {
          role: 'user',
          content: `Generate an engaging summary for these promo items: ${cacheKey}`,
        },
      ],
    });

    const aiSummary =
      response.choices[0].message.content ||
      'Here are the list of promo items that you can avail today.';

    const updatedPromos = await Promise.all(
      promos.map(async (promo) => {
        try {
          const promoResponse = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content:
                  'You are an AI that provides concise and engaging insights about promotional discounts. Keep it brief and engaging. Ensure that insights are within 40 words and highlight key terms briefly.',
              },
              {
                role: 'user',
                content: `Provide an engaging summary for these promotions: ${JSON.stringify(promo)}`,
              },
            ],
          });

          return {
            aiNote:
              promoResponse.choices[0].message.content ||
              'Enjoy this exclusive promo offer!',
            ...promo,
          };
        } catch (promoError) {
          console.error('Error generating AI note for promo:', promoError);
          return {
            aiNote: 'Enjoy this exclusive promo offer!',
            ...promo,
          };
        }
      }),
    );

    const finalResponse = {
      ai: aiSummary,
      promos: updatedPromos,
    };
    aiInsightCache.set(cacheKey, JSON.stringify(finalResponse));

    return finalResponse;
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return {
      ai: 'Here are the list of promo items that you can avail today.',
      promos: Array.isArray(promos)
        ? promos.map((promo) => ({
          aiNote: 'Enjoy this exclusive promo offer!',
          ...promo,
        }))
        : [],
    };
  }
};
