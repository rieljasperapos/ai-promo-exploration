import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateAiInsight = async (promos: any[]) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI that provides insights about promotional discounts.',
        },
        {
          role: 'user',
          content: `Generate an engaging note for these promo items: ${JSON.stringify(promos)}`,
        },
      ],
    });

    return (
      response.choices[0].message.content ||
      'Here are the list of promo items that you can avail today'
    );
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return 'Here are the list of promo items that you can avail today';
  }
};
