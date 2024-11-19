
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Truck,RefreshCcw,Headphones,ArrowRight,ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Footer from '@/components/Footer'

const categories = [
  { name: "Mobiles, Computers", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9iaWxlJTIwcGhvbmV8ZW58MHx8MHx8fDA%3D" },
  { name: "TV, Appliances, Electronics", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHZ8ZW58MHx8MHx8fDA%3D" },
  { name: "Men's Fashion", image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVucyUyMGZhc2hpb258ZW58MHx8MHx8fDA%3D" },
  { name: "Women's Fashion", image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29tZW5zJTIwZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D" },
  { name: "Home, Kitchen, Pets", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2l0Y2hlbnxlbnwwfHwwfHx8MA%3D%3D" },
  { name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXR5JTIwcHJvZHVjdHN8ZW58MHx8MHx8fDA%3D" },
  { name: "Health", image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aGVhbHRoJTIwcHJvZHVjdHN8ZW58MHx8MHx8fDA%3D" },
  { name: "Grocery", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JvY2VyeXxlbnwwfHwwfHx8MA%3D%3D" },
  { name: "Sports, Fitness, Bags, Luggage", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3BvcnRzJTIwZXF1aXBtZW50fGVufDB8fDB8fHww" },
  { name: "Toys, Baby Products, Kids' Fashion", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG95c3xlbnwwfHwwfHx8MA%3D%3D" },
  { name: "Car, Motorbike, Industrial", image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FyfGVufDB8fDB8fHww" },
  { name: "Books", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3N8ZW58MHx8MHx8fDA%3D" },
  { name: "Movies, Music & Video Games", image: "https://images.unsplash.com/photo-1586899028174-e7098604235b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dmlkZW8lMjBnYW1lc3xlbnwwfHwwfHx8MA%3D%3D" },
]


const offers = [
  { 
    id: 1, 
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGVjb21tZXJjZSUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D", 
    alt: "Electronics Sale", 
    title: "Mega Electronics Sale", 
    description: "Up to 50% off on latest gadgets" 
  },
  { 
    id: 2, 
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFzaGlvbiUyMHNob3BwaW5nfGVufDB8fDB8fHww", 
    alt: "Fashion Week", 
    title: "Fashion Week Specials", 
    description: "Trendy outfits at unbeatable prices" 
  },
  { 
    id: 3, 
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9tZSUyMGRlY29yfGVufDB8fDB8fHww", 
    alt: "Home Decor", 
    title: "Transform Your Space", 
    description: "20% off on all home decor items" 
  },
  { 
    id: 4, 
    image: "https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BvcnRzJTIwZXF1aXBtZW50fGVufDB8fDB8fHww", 
    alt: "Fitness Gear", 
    title: "Get Fit for Less", 
    description: "Huge discounts on fitness equipment" 
  },
  { 
    id: 5, 
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D", 
    alt: "Audio Sale", 
    title: "Sound of Savings", 
    description: "Premium audio gear at rock-bottom prices" 
  },
];



type Product = {
  id: number;
  images: string[];
  title: string;
  price: number;
};

export default function HomePage() {
  const [currentOffer, setCurrentOffer] = useState(0)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products'); // Fetch all products
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setFeaturedProducts(data.slice(0, 4)); // Get the first 3 products
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      
      <main className="container mx-auto px-4 py-8">
      <section className="mb-12">
      <div className="relative h-[400px] overflow-hidden rounded-lg">
        {offers.map((offer, index) => (
          <div
            key={offer.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentOffer ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={offer.image}
              alt={offer.alt}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent">
              <div className="absolute bottom-10 left-10 text-white">
                <h2 className="text-4xl font-bold mb-2">{offer.title}</h2>
                <p className="text-xl">{offer.description}</p>
              </div>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={() => setCurrentOffer((prev) => (prev - 1 + offers.length) % offers.length)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={() => setCurrentOffer((prev) => (prev + 1) % offers.length)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {offers.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentOffer ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentOffer(index)}
            />
          ))}
        </div>
      </div>
    </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="rounded-lg mb-2 w-full h-40 object-cover"
                  />
                <h3 className="font-semibold text-center text-sm">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

         {/* Featured Products */}
       <section className="bg-white py-16">
         <div className="container mx-auto px-4">
           <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
           {loading && <p>Loading...</p>}
           {error && <p>Error: {error}</p>}
           {!loading && !error && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {featuredProducts.map((product) => (
                 <div key={product.id} className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
                   <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover" />
                   <div className="p-4">
                     <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                     <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
                     <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300 flex items-center justify-center">
                       <ShoppingBag className="w-5 h-5 mr-2" />
                       Add to Cart
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           )}
           <div className="text-center mt-8">
             <Link href="/products" className="text-blue-600 font-semibold hover:text-blue-800 flex items-center justify-center">
               View All Products
               <ArrowRight className="w-5 h-5 ml-2" />
             </Link>
           </div>
         </div>
       </section>

               <section className="bg-white py-16">
         <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="text-center">
               <Truck className="w-12 h-12 mx-auto mb-4 text-blue-600" />
               <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
               <p className="text-gray-600">On orders over $50</p>
             </div>
             <div className="text-center">
               <RefreshCcw className="w-12 h-12 mx-auto mb-4 text-blue-600" />
               <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
               <p className="text-gray-600">30-day return policy</p>
             </div>
             <div className="text-center">
               <Headphones className="w-12 h-12 mx-auto mb-4 text-blue-600" />
               <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
               <p className="text-gray-600">Here to help anytime</p>
             </div>
           </div>
         </div>
       </section>
      </main>
      <Footer />

      
    </div>
  )
}
