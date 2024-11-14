import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string;
  favorites: Set<number>;
  cart:Set<number>;
  favoritesCount:number;
  cartCount:number;
  setUser: (user: { name: string; favorites: number[];cart:number[];}) => void;
  logout: () => void;
  toggleFavorite: (productId: number) => Promise<void>;
  toggleCart:(productId:number)=> Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [cart,setCart]=useState<Set<number>>(new Set());


  useEffect(()=>{
    const storedAuth=localStorage.getItem('auth');
    if(storedAuth){
        const {isAuthenticated,userName}=JSON.parse(storedAuth)
        setIsAuthenticated(isAuthenticated);
        setUserName(userName);
    }
  })

  useEffect(() => {
    const fetchFavorites = async () => {
      if(!userName) return;
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

  if (isAuthenticated) {
    fetchFavorites();
    fetchCart();
  }
}, [isAuthenticated,userName]);

  const setUser = (user: { name: string; favorites: number[]; cart:number[] }) => {
    setIsAuthenticated(true);
    setUserName(user.name);
    setFavorites(new Set(user.favorites)); 
    setCart(new Set(user.cart))
    localStorage.setItem('auth',JSON.stringify({
        isAuthenticated:true,
        userName:user.name,
    }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserName('');
    setFavorites(new Set());
    localStorage.removeItem('auth');
  };

  const toggleFavorite = async (productId: number) => {
    const updatedFavorites = new Set(favorites);
    if (updatedFavorites.has(productId)) {
      updatedFavorites.delete(productId);
      toast.info("Removed from favorites")
    } else {
      updatedFavorites.add(productId);
      toast.success('Added to Favorites')
    }
    setFavorites(updatedFavorites);

    console.log(userName);
    await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name:userName, productId }),
    });
  };


  const toggleCart = async (productId: number) => {
    const updatedCart = new Set(cart);
    if (updatedCart.has(productId)) {
      updatedCart.delete(productId);
      toast.info('Removed from cart')
    } else {
      updatedCart.add(productId);
      toast.success('Added to cart ')
    }
    setCart(updatedCart);
    await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name:userName, productId }),
    });
  };


  const contextValue = useMemo(() => ({
    isAuthenticated,
    userName,
    favorites,
    cart,
    favoritesCount: favorites.size,
    cartCount: cart.size,
    setUser,
    toggleCart,
    logout,
    toggleFavorite
  }), [isAuthenticated, userName, favorites, cart]);

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