
import React, { useState,useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Package, User, Menu } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import FilterPanel from './FilterPanel';
import {useRouter} from 'next/router';

interface NavbarProps {
  readonly isAuthenticated: boolean;
  readonly userName: string;
  readonly favoritesCount: number;
  readonly cartCount: number;
}

export default function Navbar({ isAuthenticated, userName, favoritesCount, cartCount }: NavbarProps) {

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    title: string,
    brand: string,
    rating: number,
    price: number,
    discountedPrice: number,
    discountPercentage: number,
    description: string,
    shippingInformation: string,
    returnPolicy: string,
    image: string,
  }>>([]);
  const [data, setData] = useState<Array<{
    image: string,
    title: string,
    brand: string,
    rating: number,
    price: number,
    discountedPrice: number,
    discountPercentage: number,
    description: string,
    shippingInformation: string,
    returnPolicy: string,
  }> | null>(null)
  const router =useRouter(); 
  

  const { logout } = useAuth();

  useEffect(() => {
    if (searchQuery) {
      const filteredResults = data ? data.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) : [];
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, data]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?q=${searchQuery}`);
  }
 

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <FilterPanel
                  categories={[]}
                  sizes={[]}
                  colors={[]}
                  selectedFilters={{
                    category: [],
                    size: [],
                    color: [],
                    priceRange: [0, 1000],
                  }}
                  onFilterChange={() => {}}
                />
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">Shop Buddy</span>
            </Link>
          </div>
          <div className="flex-1 mx-4">
            <form onSubmit={handleSearchSubmit} className="flex w-full max-w-sm items-center space-x-2">
              <div className="relative flex-1">
                {/* <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" /> */}
                <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
          />
              </div>
              <Button type="submit" variant="secondary">Search</Button>
            </form>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/products" className="hidden sm:block">
              <Button variant="ghost">Products</Button>
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/favorites" className="relative">
                  <Button variant="ghost" size="icon" className="relative">
                    <Heart className="h-5 w-5" />
                    {favoritesCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                        {favoritesCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link href="/orders">
                  <Button variant="ghost" size="icon">
                    <Package className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/cart" className="relative">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                     <Link href='/profile'>                      
                      <span>Profile</span></Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/signin">
                <Button variant="secondary">Login</Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}