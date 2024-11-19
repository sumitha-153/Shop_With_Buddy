

import { useSession, signOut } from 'next-auth/react';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string;
  favorites: Set<number>;
  cart: Set<number>;
  favoritesCount: number;
  cartCount: number;
  setUser: (user: { name: string; favorites: number[]; cart: number[]; }) => void;
  logout: () => void;
  toggleFavorite: (productId: number) => Promise<void>;
  toggleCart: (productId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [cart, setCart] = useState<Set<number>>(new Set());
  const { data: session, status } = useSession();
  console.log("---------");
  console.log(session?.user);
  
  

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUserName(session.user.name as string);
    } else {
      setUserName('');
    }
  }, [status, session]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userName) return;
      const response = await fetch(`/api/favorites?name=${encodeURIComponent(userName)}`);
      if (response.ok) {
        const favoriteIds = await response.json();
        setFavorites(new Set(favoriteIds));
      }
    };

    const fetchCart = async () => {
      const response = await fetch(`/api/cart?name=${encodeURIComponent(userName)}`);
      if (response.ok) {
        const cartIds = await response.json();
        setCart(new Set(cartIds));
      }
    };

    if (status === 'authenticated') {
      fetchFavorites();
      fetchCart();
    }
  }, [status, userName]);

  const setUser = (user: { name: string; favorites: number[]; cart: number[] }) => {
    setUserName(user.name);
    setFavorites(new Set(user.favorites));
    setCart(new Set(user.cart));
  };

  const logout = () => {
    signOut({ callbackUrl: '/' });
    setUserName('');
    setFavorites(new Set());
    setCart(new Set());
  };

  const toggleFavorite = async (productId: number) => {
    const updatedFavorites = new Set(favorites);
    if (updatedFavorites.has(productId)) {
      updatedFavorites.delete(productId);
      toast.info("Removed from favorites");
    } else {
      updatedFavorites.add(productId);
      toast.success('Added to Favorites');
    }
    setFavorites(updatedFavorites);

    await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: userName, productId }),
    });
  };

  const toggleCart = async (productId: number) => {
    const updatedCart = new Set(cart);
    if (updatedCart.has(productId)) {
      updatedCart.delete(productId);
      toast.info('Removed from cart');
    } else {
      updatedCart.add(productId);
      toast.success('Added to cart');
    }
    setCart(updatedCart);
    await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: userName, productId }),
    });
  };

  const contextValue = useMemo(() => ({
    isAuthenticated: status === 'authenticated',
    userName,
    favorites,
    cart,
    favoritesCount: favorites.size,
    cartCount: cart.size,
    setUser,
    toggleCart,
    logout,
    toggleFavorite
  }), [status, userName, favorites, cart]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};