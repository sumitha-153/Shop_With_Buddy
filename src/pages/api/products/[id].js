import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('Styliee'); // Replace with your database name

  const { id } = req.query; // Get the product ID from the URL

  if (req.method === 'GET') {
    const product = await db.collection('products').findOne({ id: parseInt(id) }); // Adjust the query as needed
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 

//give star rating in products page and keep only the add to cart symbol and the heart border should be black when the products is favorites only it should chnage to read heart and when title is clicked the single product should be listed 