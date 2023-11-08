// pages/api/chat.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIApi } from 'openai';

// Initialize OpenAI client with your API key from the environment variables
const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatRequestBody {
  message: string;
}

interface ChatResponseData {
  response: string;
}

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponseData | ErrorResponse>
) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Extract the message from the request body
  const { message }: ChatRequestBody = req.body;

  // Check if the message text was provided
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    // Make a request to OpenAI's chat completion endpoint
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // Replace with your preferred model
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
    });

    // Check if OpenAI's response is structured as expected
    if (!completion.data.choices || completion.data.choices.length === 0 || !completion.data.choices[0].message) {
      console.error('Unexpected response structure from OpenAI:', completion.data);
      return res.status(500).json({ error: 'Received an unexpected response structure from OpenAI.' });
    }

    // Extract the message content from OpenAI's response
    const responseMessage = completion.data.choices[0].message.content;
    return res.status(200).json({ response: responseMessage });
  } catch (error: any) {
    // Log the error to the server console
    console.error('Error calling OpenAI:', error);
    console.error('Error details:', error.response?.data || error.message);

    // Respond with a generic error message
    return res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}
