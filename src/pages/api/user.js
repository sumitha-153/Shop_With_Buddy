import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('Styliee'); 

  if (req.method === 'GET') {
    const {name}=req.query;
    console.log(name);
    

    const user = await db.collection('users').findOne({name}); 
    console.log("AFter user");
    console.log(user);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } else if (req.method === 'PUT') {
    const { userName, shippingInfo, paymentInfo } = req.body;
    console.log("Inside User.js");
    console.log(req.body);
    console.log(shippingInfo);
    
    try {
      const result = await db.collection('users').updateOne(
        { name: userName },
        {
          $set: {
            shippingInfo,
            paymentInfo,
          },
        }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User information updated successfully' });
    } catch (error) {
      console.error('Failed to update user info:', error);
      res.status(500).json({ message: 'Failed to update user info' });
    }
  }else if( req.method === 'POST'){
    const {address,city,postalCode,country,state,userName}=req.body;
    console.log("Inside User.js");
    console.log(req.body);

    const user =await db.collection('users').findOne({name:userName});
    if(!user){
      return res.status(404).json({message:'User not found'});
    }
    try {
      const result = await db.collection('users').updateOne(
        {name: userName},
        {
          $push: {
            shippingInfo: {
              address,
              city,
              postalCode,
              country,
              state,
            },
          },
        }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User information updated successfully' });
    } catch (error) {
      console.error('Failed to update user info:', error);
      res.status(500).json({ message: 'Failed to update user info' });  
   } 
  }
  else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 