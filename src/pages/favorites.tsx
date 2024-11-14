import { useEffect, useState } from 'react';
import { Heart, Star } from 'lucide-react';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import SkeletonLoader from '@/components/SkeletonLoader';
import ProductCard from '@/components/ProductCard';

export default function Favorites() {
  const { favorites,toggleFavorite} = useAuth(); // Get favorites from Auth context
  const [favoriteProducts, setFavoriteProducts] = useState<Array<{ id: number; images: string[]; title: string; description: string; price: number; rating: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      try {
        const response = await fetch('/api/products'); // Fetch all products
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const allProducts = await response.json();
        const filteredFavorites = allProducts.filter((product: { id: number; }) => favorites.has(product.id)); // Filter products based on favorites
        setFavoriteProducts(filteredFavorites);
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

    fetchFavoriteProducts();
  }, [favorites]);


  // const handleToggleFavorite = async (productId: number) => {
  //   await toggleFavorite(productId); // Toggle favorite status
  //   setFavoriteProducts((prevFavorites) => prevFavorites.filter((product) => product.id !== productId)); // Update local state
  // };

  if (loading) return <SkeletonLoader/>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="container flex-1 px-4 py-8 mx-auto">
        <h1 className="mb-4 text-3xl font-bold">Favorite Products</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {favoriteProducts.length > 0 ? (
            favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p>No favorite products found.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
} 