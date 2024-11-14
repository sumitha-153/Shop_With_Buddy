import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('Styliee'); // Replace with your database name

  const { category } = req.query; // Get the category from the query parameters

  if (req.method === 'GET') {
    const query = category ? { category: { $regex: category, $options: 'i' } } : {}; // Filter by category if provided
    const products = await db.collection('products').find(query).toArray(); // Fetch products based on the query
    res.json(products);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 