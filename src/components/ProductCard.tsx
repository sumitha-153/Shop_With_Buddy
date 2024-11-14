// import Link from 'next/link';
// import { Heart, Star } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// interface ProductCardProps {
//   product: {
//     id: number;
//     images: string[];
//     title: string;
//     description: string;
//     price: number;
//     rating: number;
//   };
// }



// export default function ProductCard({ product }: ProductCardProps) {
//   const { favorites, toggleFavorite, cart, toggleCart } = useAuth();

//   const handleToggleFavorite = async (productId: number) => {
//     await toggleFavorite(productId);
//   };

//   const handleToggleCart = async (productId: number) => {
//     await toggleCart(productId); 
//   };

//   return (
//     <div key={product.id} className="relative p-4 border rounded-lg shadow-md">
//       <Link href={`/products/${product.id}`}>
//         <img
//           src={product.images[0]}
//           alt={product.title}
//           className="object-cover w-full h-48 mb-2 rounded-md"
//           loading="lazy"
//         />
//       </Link>
//       <Heart
//         className={`absolute top-2 right-2 cursor-pointer ${favorites.has(product.id) ? 'text-red-500' : 'text-gray-500'}`}
//         onClick={() => toggleFavorite(product.id)}
//       />
//       <h2 className="text-xl font-semibold">
//                 <Link href={`/products/${product.id}`}>{product.title}</Link>
//               </h2>
//       <p className="text-gray-600">{product.description}</p>
//       <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
//       <div className="flex items-center mb-2 gap-14">
//       <div className="flex items-center ">
//           {[...Array(5)].map((_, i) => (
//             <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
//           ))}
//           <span className="ml-2 text-gray-600">({product.rating.toFixed(1)})</span>
//         </div>
//         <button
//           onClick={() => handleToggleCart(product.id)}
//           className={`px-4 py-2 text-white transition duration-300 rounded-md ${cart.has(product.id) ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
//         >
//           {cart.has(product.id) ? 'Remove from Cart' : 'Add to Cart'}
//         </button>
//       </div>
//     </div>
//   );
// }



import Link from 'next/link';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  readonly product: {
    id: number;
    images: string[];
    title: string;
    description: string;
    price: number;
    rating: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { favorites, toggleFavorite, cart, toggleCart } = useAuth();

  const handleToggleFavorite = async (productId: number) => {
    await toggleFavorite(productId);
  };

  const handleToggleCart = async (productId: number) => {
    await toggleCart(productId); 
  };

  return (
    <div key={product.id} className="group relative overflow-hidden bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <Link href={`/products/${product.id}`} className="block aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <button
        onClick={() => handleToggleFavorite(product.id)}
        className={`absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-colors duration-300 ${
          favorites.has(product.id) ? 'text-red-500 hover:bg-red-100' : 'text-gray-500 hover:bg-gray-100'
        }`}
        aria-label={favorites.has(product.id) ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart className="w-5 h-5" fill={favorites.has(product.id) ? "currentColor" : "none"} />
      </button>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 line-clamp-1">
          <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors duration-300">
            {product.title}
          </Link>
        </h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="ml-2 text-sm text-gray-600">({product.rating.toFixed(1)})</span>
          </div>
        </div>
        <button
          onClick={() => handleToggleCart(product.id)}
          className={`max-w-5xl px-4 py-2 text-black transition duration-300 rounded-md border border-black flex items-center justify-center gap-2 ${
            cart.has(product.id) ? 'bg-blue-600 hover:bg-red-700' : 'text-black hover:bg-primary-dark'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {cart.has(product.id) ? 'Remove from Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}