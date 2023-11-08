// pages/api/chat.ts in your Next.js app
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Forward the API call to the FastAPI backend
  const response = await fetch('http://localhost:8000/chat/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  });

  if (!response.ok) {
    // Forward any error messages from FastAPI
    const error = await response.text();
    return res.status(response.status).json({ error });
  }

  // Send the successful response back to the frontend
  const data = await response.json();
  res.status(200).json(data);
}
