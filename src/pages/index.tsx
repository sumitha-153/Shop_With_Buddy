import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Truck, RefreshCcw, Headphones, Smartphone, Laptop, Tv, Home, Heart, Book, Film, Hospital, Luggage } from 'lucide-react';

export default function HomePage() {
  interface Product {
    id: number;
    title: string;
    price: number;
    images: string[];
  }

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const categories = [
    { name: 'Mobiles', icon: <Smartphone className="w-6 h-6 mx-auto" /> },
    { name: 'Computers', icon: <Laptop className="w-6 h-6 mx-auto" /> },
    { name: 'TV', icon: <Tv className="w-6 h-6 mx-auto" /> },
    { name: 'Appliances', icon: <Home className="w-6 h-6 mx-auto" /> },
    { name: 'Men\'s Fashion', icon: <ShoppingBag className="w-6 h-6 mx-auto" /> },
    { name: 'Women\'s Fashion', icon: <ShoppingBag className="w-6 h-6 mx-auto" /> },
    { name: 'Home, Kitchen, Pets', icon: <Home className="w-6 h-6 mx-auto" /> },
    { name: 'Beauty', icon: <Heart className="w-6 h-6 mx-auto" /> },
    {name:'Health',icon: <Hospital className='w-6 h-6 mx-auto'/>},
    {name:  'Grocery', icon : <ShoppingBag className='w-6 h-6 mx-auto'/>},
    { name: 'Sports, Fitness', icon: <ShoppingBag className="w-6 h-6 mx-auto" /> },
    {name: 'Bags, Luggage', icon: <Luggage className="w-6 h-6 mx-auto"/>},
    { name: 'Toys, Baby Products, Kids\' Fashion', icon: <ShoppingBag className="w-6 h-6 mx-auto" /> },
    { name: 'Car, Motorbike, Industrial', icon: <Truck className="w-6 h-6 mx-auto" /> },
    { name: 'Books', icon: <Book className="w-6 h-6 mx-auto" /> },
    { name: 'Movies, Music & Video Games', icon: <Film className="w-6 h-6 mx-auto" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-24 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Summer Sale is On!</h1>
            <p className="text-xl mb-6">Get up to 50% off on selected items. Limited time offer.</p>
            <Link href="/products" className="bg-white text-blue-600 py-3 px-8 rounded-full font-semibold hover:bg-blue-100 transition duration-300">
              Shop Now
            </Link>
          </div>
          <div className="md:w-1/2">
            {/* <img src="/placeholder.svg?height=400&width=600" alt="Summer Sale" className="rounded-lg shadow-xl" /> */}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link key={category.name} href={`/products?category=${encodeURIComponent(category.name)}`} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition duration-300">
                <div className="mb-2">{category.icon}</div>
                <h3 className="text-xl font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
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

      {/* Special Offer */}
      <section className="bg-yellow-400 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Special Offer!</h2>
          <p className="text-xl mb-6">Use code SUMMER20 at checkout to get an extra 20% off!</p>
          <Link href="/products" className="bg-black text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-800 transition duration-300">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features */}
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

      {/* Newsletter */}
      <section className="bg-gray-200 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-xl mb-6">Get the latest updates on new products and upcoming sales</p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-r-full hover:bg-blue-700 transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
