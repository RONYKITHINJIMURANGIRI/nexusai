export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = await request.json();
  response.status(200).json({
    reply: 'This is a placeholder chat response from NexusAI.',
    received: body,
  });
}
