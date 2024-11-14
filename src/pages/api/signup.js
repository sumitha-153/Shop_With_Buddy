import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('Styliee');

  if (req.method === 'POST') {
    const { name, email, password, phone } = req.body;

    // Check if the user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = {
      name,
      email,
      password,
      phone,
      favorites: [],
      cart: [],
      orders: [],
    };

    await db.collection('users').insertOne(newUser);
    res.status(201).json({ message: 'User created successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 