import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('Styliee'); // Replace with your database name

  if(req.method=== 'GET'){
    const {name}=req.query;
    const user=await db.collection('users').findOne({name});
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user.cart);

  }
  else if (req.method === 'POST') {
    const { name, productId } = req.body;

    const user = await db.collection('users').findOne({ name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cart = user.cart || [];
    if (cart.includes(productId)) {

      await db.collection('users').updateOne(
        { name },
        { $pull: { cart: productId } }
      );
      return res.status(200).json({ message: 'Product removed from cart' });
    } else {
      // Add to cart
      await db.collection('users').updateOne(
        { name},
        { $addToSet: { cart: productId } }
      );
      return res.status(200).json({ message: 'Product added to cart' });
    }
  } else {
    res.setHeader('Allow', ['POST','GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 