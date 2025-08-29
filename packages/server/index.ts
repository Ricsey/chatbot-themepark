import express, { response } from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' });
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' });
});

const conversations = new Map<string, string>();

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt is too long (max 1000 characters)'),
  conversationId: z.string().uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const parseResult = chatSchema.safeParse(req.body);
  if (!parseResult.success) {
    const { errors } = z.treeifyError(parseResult.error);
    res.status(400).json({ errors: errors });
    return;
  }

  try {
    const { prompt, converstionId } = req.body;
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id: conversations.get(converstionId),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate response.' });
  }

  conversations.set(converstionId, response.id);

  res.json({ message: response.output_text });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
