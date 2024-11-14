import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('Styliee'); // Replace with your database name

  if (req.method === 'POST') {
    const { productId, rating, comment, reviewerName } = req.body;

    console.log("inside review.js");
    
    console.log(req.body);
    

    console.log("Before product review");
    
    const product = await db.collection('products').findOne({ id: parseInt(productId ,10)});
    console.log(product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log(product);

    const newReview = {
      rating,
      comment,
      date: new Date().toISOString(),
      reviewerName,
    };

    console.log(newReview);
    

    await db.collection('products').updateOne(
      { id: productId },
      { $push: { reviews: newReview } }
    );

    res.status(200).json({ message: 'Review added successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 