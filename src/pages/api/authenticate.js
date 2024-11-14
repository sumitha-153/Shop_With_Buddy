import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('Styliee'); 

  if (req.method === 'POST') {
    const { email, password } = req.body;
    console.log("Email and Password "+email+" "+password);
    
    const user = await db.collection('users').findOne({ email });

    if (!user || user.password !== password) { 
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const { ...userData } = user; 
    res.status(200).json(userData);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 