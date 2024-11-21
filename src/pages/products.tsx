import { useEffect, useState } from 'react';
import {  Menu, X } from 'lucide-react';
import Footer from '../components/Footer';
import SkeletonLoader from '../components/SkeletonLoader';
import ProductCard from '@/components/ProductCard';
import FilterPanel from '@/components/FilterPanel';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  rating: number;
  category: string;
  size: string;
  color: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{
    category: string[];
    size: string[];
    color: string[];
    priceRange: [number, number];
  }>({
    category: [],
    size: [],
    color: [],
    priceRange: [0, 1000],
  });

  // Side panel state
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
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

  const handleFilterChange = (filterType: string, value: string | number[]) => {
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (filterType === 'category' || filterType === 'size' || filterType === 'color') {
        if (newFilters[filterType].includes(value as string)) {
          newFilters[filterType] = newFilters[filterType].filter((v) => v !== value);
        } else {
          newFilters[filterType].push(value as string);
        }
      } else if (filterType === 'priceRange') {
        if ((value as number[]).length === 2) {
          newFilters.priceRange = value as [number, number];
        }
      }
      return newFilters;
    });
  };

  const filteredProducts = products.filter((product) => {
    const inCategory = selectedFilters.category.length === 0 || selectedFilters.category.includes(product.category);
    const inSize = selectedFilters.size.length === 0 || selectedFilters.size.includes(product.size);
    const inColor = selectedFilters.color.length === 0 || selectedFilters.color.includes(product.color);
    const inPriceRange = product.price >= selectedFilters.priceRange[0] && product.price <= selectedFilters.priceRange[1];
    return inCategory && inSize && inColor && inPriceRange;
  });

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="container flex-1 px-4 py-8 mx-auto">
          <h1 className="mb-4 text-3xl font-bold">Products</h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="container flex-1 px-4 py-8 mx-auto flex">
        {/* Backdrop overlay */}
        {isPanelOpen && (
          <button
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={() => setIsPanelOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsPanelOpen(false);
              }
            }}
          ></button>
        )}
        
        <div className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 z-50 ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4">
            <button onClick={() => setIsPanelOpen(false)} className="mb-4">
              <X className="w-6 h-6" />
            </button>
            <FilterPanel
              categories={['Electronics', 'Clothing', 'Home']} // Example categories
              sizes={['S', 'M', 'L', 'XL']} // Example sizes
              colors={['Red', 'Blue', 'Green']} // Example colors
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="flex-1 ml-0 transition-all duration-300" style={{ marginLeft: isPanelOpen ? '250px' : '0' }}>
          <button onClick={() => setIsPanelOpen(true)} className="mb-4">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="mb-4 text-3xl font-bold">Products</h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

