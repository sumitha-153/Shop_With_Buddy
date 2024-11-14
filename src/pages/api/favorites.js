import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('Styliee'); 

  if (req.method === 'GET') {
    const { name } = req.query; 

    const user = await db.collection('users').findOne({ name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.favorites);

  } else if (req.method === 'POST') {

    const { name, productId } = req.body;

    console.log("Inside Favorite.js"+ name+" "+productId);
    
    const user = await db.collection('users').findOne({ name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const favorites = user.favorites || [];
    if (favorites.includes(productId)) {
      await db.collection('users').updateOne(
        { name },
        { $pull: { favorites: productId } }
      );
      return res.status(200).json({ message: 'Product removed from favorites' });
    } else {
      // Add to favorites
      await db.collection('users').updateOne(
        { name },
        { $addToSet: { favorites: productId } }
      );
      return res.status(200).json({ message: 'Product added to favorites' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 