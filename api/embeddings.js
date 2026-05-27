export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  response.status(200).json({
    embeddings: [],
    message: 'Embeddings proxy placeholder created.',
  });
}
