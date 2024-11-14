import { useEffect, useState } from 'react';

import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import SkeletonLoader from '@/components/SkeletonLoader';
import ProductCard from '@/components/ProductCard';

export default function Cart() {
  const { cart } = useAuth(); // Get cart from Auth context
  const [cartProducts, setCartProducts] = useState<{ id: number; images: string[]; title: string; description: string; price: number; rating: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({}); // Track quantities

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const response = await fetch('/api/products'); // Fetch all products
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const allProducts = await response.json();
        const filteredCart = allProducts.filter((product: { id: number; }) => cart.has(product.id)).map((product: { id: number; images: string[]; title: string; description: string; price: number; rating: number }) => ({
          ...product,
          images: product.images || [],
          title: product.title || 'No title',
          description: product.description || 'No description',
          rating: product.rating || 0,
        })); // Filter and map products based on cart
        setCartProducts(filteredCart);
        // Initialize quantities for each product in the cart
        const initialQuantities: { [key: number]: number } = {};
        filteredCart.forEach((product: { id: number; images: string[]; title: string; description: string; price: number; rating: number }) => {
          initialQuantities[product.id] = 1; // Default quantity is 1
        });
        setQuantities(initialQuantities);
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

    fetchCartProducts();
  }, [cart]);

  const handleQuantityChange = (productId: number, change: number) => {
    setQuantities((prevQuantities) => {
      const newQuantity = (prevQuantities[productId] || 1) + change;
      return {
        ...prevQuantities,
        [productId]: Math.max(newQuantity, 1), // Ensure quantity is at least 1
      };
    });
  };

  const calculateTotal = () => {
    return cartProducts.reduce((total, product: { id: number; price: number }) => {
      const quantity = quantities[product.id] || 1; // Default to 1 if not set
      return total + product.price * quantity;
    }, 0).toFixed(2);
  };

  if (loading) return <SkeletonLoader/>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
    <div className="flex flex-col min-h-screen">
      <main className="container flex-1 px-4 py-8 mx-auto">
        <h1 className="mb-4 text-3xl font-bold">Your Cart</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cartProducts.length > 0 ? (
            cartProducts.map((product) => (
              <div key={product.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
                <ProductCard product={product} />
                <div className="flex items-center mb-2 mt-2">
                  <button 
                    onClick={() => handleQuantityChange(product.id, -1)} 
                    className="px-2 py-1 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors duration-200"
                  >
                    -
                  </button>
                  <span className="mx-2 text-lg font-semibold">{quantities[product.id] || 1}</span> {/* Display current quantity */}
                  <button 
                    onClick={() => handleQuantityChange(product.id, 1)} 
                    className="px-2 py-1 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors duration-200"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-bold text-blue-600">Total Amount: ${calculateTotal()}</h2>
        </div>
      </main>
      <Footer />
    </div>
    </>
  );
} 