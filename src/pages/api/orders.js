import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('Styliee');

  if (req.method === 'POST') {
    const { userName,status, productId, shippingInfo, paymentInfo ,quantity,totalCost,image} = req.body;
    console.log("Inside order.js");
    console.log(req.body);
    const product = await db.collection('products').findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }   
        
    // Structure the order details
    const orderDetails = {
      productId,
      title: product.title,
      price: totalCost,
      image: image,
      quantity: quantity, 
      date: new Date().toISOString(),
      shippingInfo,
      paymentInfo,
      status,
    };

    const user = await db.collection('users').findOne({ name: userName});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await db.collection('users').updateOne(
      { name:userName },
      { $addToSet: { orders: orderDetails } }
    );

    res.status(200).json({ message: 'Order placed successfully' });
  } else if (req.method === 'GET') {
    const { name } = req.query;

    const user = await db.collection('users').findOne({ name });
    // console.log(user);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.orders);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 