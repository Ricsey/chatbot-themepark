import fs from 'fs';
import OpenAI from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';
import template from '../prompts/chatbot.txt';
import path from 'path';

const client = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

type ChatResponse = {
  id: string;
  message: string;
};

const parkInfo = fs.readFileSync(
  path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
  'utf-8'
);

const instructions = template.replace('{{parkInfo}}', parkInfo);

export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> {
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      instructions,
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 200,
      previous_response_id:
        conversationRepository.getLastResponseId(conversationId),
    });

    conversationRepository.setLastResponseId(conversationId, response.id);

    return {
      id: response.id,
      message: response.output_text,
    };
  },
};
