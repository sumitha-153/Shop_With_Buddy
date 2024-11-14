import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProductCard from '@/components/ProductCard';
import SkeletonLoader from '@/components/SkeletonLoader';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SearchResults = () => {
  const router = useRouter();
  const { q } = router.query;
  interface Product {
    id:number,
    title: string,
    brand: string,
    rating: number,
    price: number,
    discountedPrice: number,
    discountPercentage: number,
    description: string,
    shippingInformation: string,
    returnPolicy: string,
    images: string[],
  }
  
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products'); // Fetch all products
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
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

    fetchProducts();
  }, []);

  useEffect(() => {
    if (q && products.length > 0) {
      const filteredResults = products.filter(product =>
        product.title.toLowerCase().includes(Array.isArray(q) ? q[0].toLowerCase() : q.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [q, products]);

  if (loading) return <SkeletonLoader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
    <h3 className="text-3xl font-bold mb-4 text-center">Search Results for "{q}"</h3>
    <div className="container mx-auto p-6 max-w-5xl flex flex-row gap-10">
      
      {searchResults.length > 0 ? (
        searchResults.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))
      ) : (
        <p>No results found.</p>
      )}<br />
    </div> </>
  );
};

export default SearchResults;