export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL required' });
  }

  try {
    const response = await fetch(url);
    const text = await response.text();
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(text);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch RSS' });
  }
}